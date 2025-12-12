#!/bin/bash
# Cleanup vLLM and HuggingFace downloads

echo "Cleaning up vLLM/HuggingFace cache..."

# Remove HuggingFace cache (where models are downloaded)
rm -rf ~/.cache/huggingface/hub/*

# Remove pip cache for vllm
pip cache remove vllm 2>/dev/null

# Uninstall vllm if installed
pip uninstall -y vllm 2>/dev/null

echo "✅ Cleanup complete!"
echo "Freed up space in:"
echo "  - ~/.cache/huggingface/"
echo "  - pip cache"
