import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const tasks = [
  {
    input: "assets/brand/logo-premium.png",
    output: "assets/brand/logo-premium.png",
    type: "png",
    width: 512
  },
  {
    input: "assets/icons/whatsapp-premium.png",
    output: "assets/icons/whatsapp-premium.png",
    type: "png",
    width: 128
  },
  {
    input: "assets/icons/instagram-premium.png",
    output: "assets/icons/instagram-premium.png",
    type: "png",
    width: 128
  },
  {
    input: "assets/icons/location-premium.png",
    output: "assets/icons/location-premium.png",
    type: "png",
    width: 128
  },
  {
    input: "assets/social/og-image.jpg",
    output: "assets/social/og-image.jpg",
    type: "jpg",
    width: 1200,
    height: 630,
    quality: 82
  },
  {
    input: "assets/images/hero-consultoria-financeira.webp",
    output: "assets/images/hero-consultoria-financeira.webp",
    type: "webp",
    width: 1440,
    quality: 76
  },
  {
    input: "assets/images/sobre-gestao-financeira.webp",
    output: "assets/images/sobre-gestao-financeira.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/dashboard-financeiro.webp",
    output: "assets/images/dashboard-financeiro.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/fluxo-de-caixa.webp",
    output: "assets/images/fluxo-de-caixa.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/contas-a-pagar.webp",
    output: "assets/images/contas-a-pagar.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/relatorios-gerenciais.webp",
    output: "assets/images/relatorios-gerenciais.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/diagnostico-financeiro.webp",
    output: "assets/images/diagnostico-financeiro.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/atendimento-consultivo.webp",
    output: "assets/images/atendimento-consultivo.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/conteudo-financeiro.webp",
    output: "assets/images/conteudo-financeiro.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/planejamento-financeiro.webp",
    output: "assets/images/planejamento-financeiro.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/consultoria-empresarial.webp",
    output: "assets/images/consultoria-empresarial.webp",
    type: "webp",
    width: 1200,
    quality: 74
  },
  {
    input: "assets/images/escritorio-premium.webp",
    output: "assets/images/escritorio-premium.webp",
    type: "webp",
    width: 1200,
    quality: 74
  }
];

async function getSize(filePath) {
  const stat = await fs.stat(filePath);
  return Number((stat.size / 1024).toFixed(2));
}

async function optimize(task) {
  const inputPath = path.join(root, task.input);
  const outputPath = path.join(root, task.output);
  const tempPath = `${outputPath}.tmp`;

  const before = await getSize(inputPath);

  let pipeline = sharp(inputPath).rotate();

  if (task.width || task.height) {
    pipeline = pipeline.resize({
      width: task.width,
      height: task.height,
      fit: task.height ? "cover" : "inside",
      withoutEnlargement: true
    });
  }

  if (task.type === "png") {
    pipeline = pipeline.png({
      compressionLevel: 9,
      palette: true,
      effort: 10
    });
  }

  if (task.type === "jpg") {
    pipeline = pipeline.jpeg({
      quality: task.quality ?? 82,
      mozjpeg: true
    });
  }

  if (task.type === "webp") {
    pipeline = pipeline.webp({
      quality: task.quality ?? 74,
      effort: 6
    });
  }

  await pipeline.toFile(tempPath);
  await fs.rename(tempPath, outputPath);

  const after = await getSize(outputPath);
  console.log(`${task.output}: ${before} KB -> ${after} KB`);
}

for (const task of tasks) {
  try {
    await optimize(task);
  } catch (error) {
    console.error(`ERRO em ${task.input}: ${error.message}`);
  }
}
