"""Gera public/og.jpg (1200x630) para a prévia do WhatsApp e redes."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(__file__).resolve().parents[1]
EQUIPE = ROOT / "public" / "img" / "equipe"
OUT = ROOT / "public" / "og.jpg"
FONTS = Path(r"C:\Windows\Fonts")

W, H = 1200, 630
FUNDO = (247, 243, 238)
TINTA = (42, 32, 25)
SUAVE = (122, 106, 92)
DOURADO = (184, 146, 90)
MADEIRA = (160, 122, 85)

FOTOS = [
    ("eduarda-vieira.png", "Eduarda"),
    ("larissa-moura.png", "Larissa"),
    ("camila-rocha.png", "Camila"),
    ("bianca-alves.png", "Bianca"),
]


def font(name: str, size: int) -> ImageFont.FreeTypeFont:
    return ImageFont.truetype(str(FONTS / name), size)


def sparkle(draw: ImageDraw.ImageDraw, cx: float, cy: float, r: float) -> None:
    pts: list[tuple[float, float]] = []
    import math

    for i in range(8):
        ang = i * math.pi / 4 - math.pi / 2
        rad = r if i % 2 == 0 else r * 0.32
        pts.append((cx + rad * math.cos(ang), cy + rad * math.sin(ang)))
    draw.polygon(pts, fill=DOURADO)


def recorte(src: Image.Image, altura: int) -> Image.Image:
    bbox = src.getchannel("A").getbbox()
    if not bbox:
        return src
    pad = 12
    x0, y0, x1, y1 = bbox
    src = src.crop(
        (
            max(0, x0 - pad),
            max(0, y0 - pad),
            min(src.width, x1 + pad),
            min(src.height, y1 + pad),
        )
    )
    escala = altura / src.height
    nw, nh = max(1, int(src.width * escala)), altura
    return src.resize((nw, nh), Image.Resampling.LANCZOS)


def main() -> None:
    canvas = Image.new("RGBA", (W, H), (*FUNDO, 255))
    listras = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    ld = ImageDraw.Draw(listras)
    for x in range(0, W, 16):
        ld.line([(x, 0), (x, H)], fill=(*MADEIRA, 16), width=1)
    canvas = Image.alpha_composite(canvas, listras)

    vinheta = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    vd = ImageDraw.Draw(vinheta)
    vd.rectangle((0, 0, W, 70), fill=(42, 32, 25, 18))
    vd.rectangle((0, H - 90, W, H), fill=(42, 32, 25, 22))
    canvas = Image.alpha_composite(canvas, vinheta.filter(ImageFilter.GaussianBlur(18)))

    pessoas: list[tuple[Image.Image, str]] = []
    for arquivo, nome in FOTOS:
        im = Image.open(EQUIPE / arquivo).convert("RGBA")
        pessoas.append((recorte(im, 560), nome))

    faixa = 900
    x0 = 268
    n = len(pessoas)
    passo = faixa / n
    bases: list[int] = []
    for i, (foto, _) in enumerate(pessoas):
        x = int(x0 + i * passo - 24)
        y = H - foto.height + 22
        bases.append(x + foto.width // 2)
        sombra = Image.new("RGBA", (foto.width, 48), (0, 0, 0, 0))
        sd = ImageDraw.Draw(sombra)
        sd.ellipse((24, 8, foto.width - 24, 44), fill=(42, 32, 25, 42))
        sombra = sombra.filter(ImageFilter.GaussianBlur(10))
        canvas.alpha_composite(sombra, (x, H - 50))
        canvas.alpha_composite(foto, (x, y))

    draw = ImageDraw.Draw(canvas)
    sparkle(draw, 78, 118, 15)

    display = font("constan.ttf", 58)
    italic = font("constani.ttf", 28)
    small = font("constan.ttf", 20)
    mini = font("constan.ttf", 17)

    draw.text((64, 150), "Glow Icon", font=display, fill=TINTA)
    draw.text((64, 222), "Unhas com assinatura.", font=italic, fill=TINTA)
    draw.line((64, 278, 300, 278), fill=DOURADO, width=2)
    draw.text((64, 304), "Canaã dos Carajás - PA", font=small, fill=SUAVE)

    for cx, (_, nome) in zip(bases, pessoas):
        caixa = draw.textbbox((0, 0), nome, font=mini)
        tw = caixa[2] - caixa[0]
        th = caixa[3] - caixa[1]
        nx = int(cx - tw / 2)
        ny = H - 38
        draw.rounded_rectangle(
            (nx - 10, ny - 5, nx + tw + 10, ny + th + 5),
            radius=11,
            fill=FUNDO,
        )
        draw.text((nx, ny), nome, font=mini, fill=TINTA)

    OUT.parent.mkdir(exist_ok=True)
    canvas.convert("RGB").save(OUT, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
