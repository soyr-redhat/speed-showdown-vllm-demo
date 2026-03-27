import os
import time
import asyncio
from typing import AsyncGenerator
from openai import AsyncOpenAI
from models import TokenEvent

class InferenceEngine:
    def __init__(self):
        api_key = os.getenv("VLLM_API_KEY", "")

        print(f"Initializing InferenceEngine with 3 vLLM endpoints")
        print(f"VLLM_STANDARD_URL: {os.getenv('VLLM_STANDARD_URL')}")
        print(f"VLLM_OPTIMIZED_URL: {os.getenv('VLLM_OPTIMIZED_URL')}")
        print(f"VLLM_QUANTIZED_URL: {os.getenv('VLLM_QUANTIZED_URL')}")
        print(f"VLLM_STANDARD_MODEL: {os.getenv('VLLM_STANDARD_MODEL')}")
        print(f"VLLM_OPTIMIZED_MODEL: {os.getenv('VLLM_OPTIMIZED_MODEL')}")
        print(f"VLLM_QUANTIZED_MODEL: {os.getenv('VLLM_QUANTIZED_MODEL')}")

        # vLLM Standard endpoint (baseline)
        self.standard_client = AsyncOpenAI(
            api_key=api_key or "EMPTY",
            base_url=os.getenv("VLLM_STANDARD_URL", "http://localhost:8001/v1")
        )

        # vLLM Optimized endpoint (with optimizations)
        self.optimized_client = AsyncOpenAI(
            api_key=api_key or "EMPTY",
            base_url=os.getenv("VLLM_OPTIMIZED_URL", "http://localhost:8002/v1")
        )

        # vLLM Quantized endpoint (optimizations + quantization)
        self.quantized_client = AsyncOpenAI(
            api_key=api_key or "EMPTY",
            base_url=os.getenv("VLLM_QUANTIZED_URL", "http://localhost:8003/v1")
        )

        self.standard_model = os.getenv("VLLM_STANDARD_MODEL", "mistralai/Mistral-Small-Instruct-2409")
        self.optimized_model = os.getenv("VLLM_OPTIMIZED_MODEL", "mistralai/Mistral-Small-Instruct-2409")
        self.quantized_model = os.getenv("VLLM_QUANTIZED_MODEL", "RedHatAI/Mistral-Small-3.1-24B-Instruct-2503-FP8-dynamic")

    async def stream_tokens(
        self,
        prompt: str,
        racer: str,
        max_tokens: int = 100
    ) -> AsyncGenerator[TokenEvent, None]:
        """Stream tokens from standard, optimized, or quantized vLLM endpoint"""

        if racer == "standard":
            client = self.standard_client
            model = self.standard_model
        elif racer == "optimized":
            client = self.optimized_client
            model = self.optimized_model
        else:  # quantized
            client = self.quantized_client
            model = self.quantized_model

        start_time = time.time()
        token_count = 0

        try:
            print(f"[{racer}] Starting inference with model: {model}, prompt length: {len(prompt)}")
            stream = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                stream=True,
                temperature=0.7
            )

            print(f"[{racer}] Stream created, waiting for tokens...")
            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    token = chunk.choices[0].delta.content
                    token_count += 1
                    elapsed = time.time() - start_time

                    yield TokenEvent(
                        racer=racer,
                        token=token,
                        index=token_count,
                        timestamp=time.time(),
                        tokens_per_sec=token_count / elapsed if elapsed > 0 else 0
                    )

        except Exception as e:
            print(f"Error in {racer} inference: {e}")
            # Yield error token
            yield TokenEvent(
                racer=racer,
                token=f"[ERROR: {str(e)}]",
                index=-1,
                timestamp=time.time(),
                tokens_per_sec=0
            )

    async def generate_complete(
        self,
        prompt: str,
        racer: str,
        max_tokens: int = 100
    ) -> tuple[str, float, float]:
        """Generate complete response and return text, time, tokens/sec"""

        if racer == "standard":
            client = self.standard_client
            model = self.standard_model
        elif racer == "optimized":
            client = self.optimized_client
            model = self.optimized_model
        else:  # quantized
            client = self.quantized_client
            model = self.quantized_model

        start_time = time.time()
        full_text = ""
        token_count = 0

        try:
            stream = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": prompt}],
                max_tokens=max_tokens,
                stream=True,
                temperature=0.7
            )

            async for chunk in stream:
                if chunk.choices and chunk.choices[0].delta.content:
                    token = chunk.choices[0].delta.content
                    full_text += token
                    token_count += 1

            elapsed = time.time() - start_time
            tokens_per_sec = token_count / elapsed if elapsed > 0 else 0

            return full_text, elapsed, tokens_per_sec

        except Exception as e:
            print(f"Error in {racer} inference: {e}")
            elapsed = time.time() - start_time
            return f"Error: {str(e)}", elapsed, 0
