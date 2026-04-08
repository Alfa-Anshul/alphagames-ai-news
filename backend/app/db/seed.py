from sqlalchemy import select
from .database import AsyncSessionLocal
from ..models.article import Article
from ..models.category import Category
from ..models.tag import Tag
from datetime import datetime, timedelta
import random

ARTICLES = [
    {
        "title": "The Future of GPUs: Beyond Rasterization into Neural Rendering",
        "slug": "future-of-gpus-neural-rendering",
        "summary": "How next-gen GPU architectures are shifting from rasterization to neural rendering cores, tensor units and real-time path tracing powered by AI.",
        "content": """## The GPU Revolution Is Just Beginning

For decades, GPUs were built around one core idea: rasterization. Convert 3D triangles to 2D pixels as fast as possible. But that paradigm is now being completely upended.

### Neural Rendering Takes Over

NVIDIA DLSS 3.5 and AMD FSR 3 already use neural networks directly inside the render pipeline. But the next generation goes further: **neural radiance fields (NeRF)** and **3D Gaussian splatting** are being accelerated in hardware.

### Tensor Cores Become First-Class Citizens

The trend is clear: GPU dies increasingly dedicate silicon to tensor operations (the core of every transformer). NVIDIA H100 devotes ~30% to tensor compute.

**The core math:**
```
Output = Activation(W . X + b)
```
Where W and X are large matrices - exactly what tensor cores accelerate with mixed-precision FP16/BF16/INT8.

### What It Means

The boundary between gaming GPU and AI accelerator is blurring. Your RTX 5090 is simultaneously your NeRF renderer, your LLM inference engine, and your game GPU.

By 2027, expect GPUs with dedicated photon simulation cores and on-chip memory bandwidths exceeding 20 TB/s using 3D-stacked HBM4.""",
        "image_url": "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?w=800",
        "category": "GPU Technology",
        "tags": ["GPU", "Neural Rendering", "NVIDIA", "Future Tech"],
        "read_time": 6,
        "featured": True
    },
    {
        "title": "Gemma 4 on Smartphones: Google On-Device AI Masterclass",
        "slug": "gemma-4-smartphone-on-device-ai",
        "summary": "Google Gemma 4 multimodal model runs natively on mid-range Android phones. Engineering behind squeezing a 4B transformer into 4GB of RAM.",
        "content": """## Gemma 4: The Phone AI That Changes Everything

Google dropped Gemma 4 and it runs on your Pixel 8a. This is a full multimodal transformer with vision and text understanding, running locally.

### The Architecture Trick: Grouped Query Attention

Gemma 4 uses **Grouped Query Attention (GQA)** to cut memory from O(n^2) to O(n*g):

```python
# GQA: multiple query heads share one K, V group
attention = softmax(Q @ K.T / sqrt(d_k)) @ V
# With GQA, K and V are shared across g query heads
```

This slashes KV-cache memory by 4-8x, critical for phones with 6-8GB RAM.

### Quantization to INT4

The full Gemma 4 4B model is 16GB in FP32. After INT4 quantization:
```
Memory = params x bits / 8 = 4B x 4 / 8 = 2GB
```
Fits in phone RAM with headroom for the OS.

### Privacy Implications

No data leaves your device. Medical queries, private chats, financial analysis - all local. This is the real revolution: not smarter AI, but private AI.""",
        "image_url": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
        "category": "Mobile AI",
        "tags": ["Gemma", "Google", "On-Device AI", "Mobile", "LLM"],
        "read_time": 7,
        "featured": True
    },
    {
        "title": "China AI Comeback: DeepSeek, Huawei Ascend and the Path to AGI",
        "slug": "china-ai-comeback-deepseek-huawei-agi",
        "summary": "Despite chip export bans, China AI ecosystem is surging. DeepSeek R1 shook the world, Huawei Ascend 910C rivals H100, and the race to AGI is no longer a Western monopoly.",
        "content": """## The Dragon Roars Back

The US chip export controls were supposed to slow China down. Instead, they sparked an engineering renaissance.

### DeepSeek R1: Efficiency as a Weapon

DeepSeek R1 achieved GPT-4-level reasoning at **1/50th the training cost**. How? **Mixture of Experts (MoE)** architecture:

```python
# MoE forward pass
# Only k/N experts active -> massive FLOPs savings
for each token:
    router(x) -> select top-k experts
    output = sum(gate_i * expert_i(x))
```

With k=2 out of N=64 experts active per token, compute drops ~32x while model capacity stays huge.

### Huawei Ascend 910C

Huawei Ascend 910C claims 800 TFLOPS BF16, matching H100 at a fraction of the cost. Chinese hyperscalers are buying it by the thousands.

### The Path to AGI

1. **Reasoning models** - chain-of-thought at scale
2. **Multimodal fusion** - vision, language, robotics
3. **Robotic embodiment** - Unitree, Agibot deploying at scale

China robotics investment of $15B in 2024 may be the real AGI bet.""",
        "image_url": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
        "category": "AI Race",
        "tags": ["DeepSeek", "China", "AGI", "Huawei", "MoE"],
        "read_time": 8,
        "featured": True
    },
    {
        "title": "NVIDIA Blackwell B200: The GPU That Rewrites the Rules",
        "slug": "nvidia-blackwell-b200-deep-dive",
        "summary": "208 billion transistors, 20 petaFLOPS FP4, NVLink 5.0 at 1.8 TB/s. The Blackwell B200 is not just a GPU upgrade, it is a new computing paradigm.",
        "content": """## Blackwell: Not an Upgrade, a Reinvention

NVIDIA Blackwell architecture represents a fundamental rethink of what a GPU is.

### The Transformer Engine 2.0

Blackwell introduces FP4 precision, the first GPU to natively compute 4-bit floating point:

```
Precision: FP32 -> FP16 -> BF16 -> FP8 -> FP4
```

Each halving of bits doubles throughput. FP4 gives 20 PFLOPS vs H100 2 PFLOPS FP8, a 10x leap for inference.

### Why Transformers Love This

Blackwell 8TB/s HBM3e bandwidth and 192MB L2 cache mean the attention matrix fits on-chip for sequences up to 128K tokens.""",
        "image_url": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
        "category": "GPU Technology",
        "tags": ["NVIDIA", "Blackwell", "B200", "AI Hardware"],
        "read_time": 6,
        "featured": False
    },
    {
        "title": "AMD MI300X vs NVIDIA H100: The Battle for AI Supremacy",
        "slug": "amd-mi300x-vs-nvidia-h100-2025",
        "summary": "AMD Instinct MI300X has 192GB HBM3 and is winning LLM inference benchmarks. Is the GPU duopoly finally cracking?",
        "content": """## The Red Team Strikes Back

For years, AI researchers dismissed AMD as a footnote. The MI300X has changed that conversation permanently.

### 192GB HBM3: The Memory Advantage

The killer feature is not compute, it is memory. 192GB vs H100 80GB means:
- **Larger models fit in a single GPU** (70B LLM without tensor parallelism)
- **Longer context windows** (memory = context capacity for KV cache)
- **Cheaper inference** (fewer GPUs per serving node)

### ROCm is Finally Good

AMD ROCm 6.0 achieves near-CUDA parity for PyTorch workloads:

```bash
hipcc --amdgpu-target=gfx942 kernel.hip.cpp
# GFX942 = CDNA3 = MI300X compute units
```""",
        "image_url": "https://images.unsplash.com/photo-1555617981-dac3772a9f6a?w=800",
        "category": "GPU Technology",
        "tags": ["AMD", "NVIDIA", "MI300X", "AI Hardware"],
        "read_time": 5,
        "featured": False
    },
    {
        "title": "The AGI Timeline: What Top Researchers Actually Believe",
        "slug": "agi-timeline-researcher-predictions-2025",
        "summary": "From Dario Amodei 2-3 years to Yann LeCun never with current methods, we map the full spectrum of AGI predictions.",
        "content": """## AGI: The Most Important Disagreement in Science

No scientific question generates more heated debate than artificial general intelligence timelines.

### The Optimist Camp

Scaling laws continue. Current transformers show emergent capabilities at scale:

```
Loss ~ N^(-0.34) x D^(-0.28)  [Chinchilla scaling law]
```

Where N = parameters, D = data tokens. The curve has not flattened.

### The Skeptic Camp

Current LLMs lack world models, causal reasoning, and compositional generalization.

### The Wild Card: Reasoning Models

Chain-of-thought plus process reward models (o1, R1) show that inference-time compute can substitute for training-time scale.""",
        "image_url": "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800",
        "category": "AGI and Research",
        "tags": ["AGI", "Research", "Scaling Laws", "LLM"],
        "read_time": 9,
        "featured": True
    },
    {
        "title": "Mixture of Experts: The Architecture Powering Every Frontier Model",
        "slug": "mixture-of-experts-architecture-frontier-models",
        "summary": "GPT-4, Gemini 1.5, Mixtral, DeepSeek all use MoE. Here is why sparse activation is the most important architectural shift since attention.",
        "content": """## MoE: The Brain-Inspired Architecture

The human brain has ~86B neurons but only a tiny fraction activate for any given thought. Mixture of Experts applies this same principle to transformers.

### The Core Idea

Replace each FFN layer with N expert FFNs plus a router:

```python
class MoELayer(nn.Module):
    def __init__(self, d_model, n_experts=64, top_k=2):
        self.router = nn.Linear(d_model, n_experts)
        self.experts = nn.ModuleList([FFN(d_model) for _ in range(n_experts)])
    
    def forward(self, x):
        gates = softmax(self.router(x))  # [batch, seq, n_experts]
        top_k_gates, top_k_idx = gates.topk(2, dim=-1)
        out = sum(g * self.experts[i](x) for g, i in zip(top_k_gates, top_k_idx))
        return out
```

### The Math

With N=64 experts and top_k=2:
- Parameters: 64x larger than dense FFN
- Active compute: 2/64 = 3.1% per token
- Net: Capacity of 64x model at ~2x compute cost""",
        "image_url": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800",
        "category": "AI Research",
        "tags": ["MoE", "Architecture", "Transformers", "DeepSeek"],
        "read_time": 10,
        "featured": True
    }
]

async def seed_articles():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Article).limit(1))
        if result.scalars().first():
            return

        category_cache = {}
        tag_cache = {}
        
        for data in ARTICLES:
            cat_name = data["category"]
            if cat_name not in category_cache:
                slug = cat_name.lower().replace(" ", "-").replace("&", "and")
                cat = Category(name=cat_name, slug=slug)
                session.add(cat)
                await session.flush()
                category_cache[cat_name] = cat
            
            article_tags = []
            for tag_name in data["tags"]:
                if tag_name not in tag_cache:
                    tag = Tag(name=tag_name, slug=tag_name.lower().replace(" ", "-"))
                    session.add(tag)
                    await session.flush()
                    tag_cache[tag_name] = tag
                article_tags.append(tag_cache[tag_name])
            
            article = Article(
                title=data["title"],
                slug=data["slug"],
                summary=data["summary"],
                content=data["content"],
                image_url=data["image_url"],
                category_id=category_cache[cat_name].id,
                read_time=data["read_time"],
                featured=data["featured"],
                published_at=datetime.utcnow() - timedelta(days=random.randint(0, 14)),
                tags=article_tags
            )
            session.add(article)
        
        await session.commit()
