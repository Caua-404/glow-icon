"""Gera public/og.jpg (1200x630) para a prévia do WhatsApp e redes."""

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
FOTO = ROOT / "public" / "img" / "eduarda.png"
OUT = ROOT / "public" / "og.jpg"
FONTS = Path(r"C:\Windows\Fonts")

W, H = 1200, 630
FUNDO = (247, 243, 238)
TINTA = (42, 32, 25)
SUAVE = (122, 106, 92)
DOURADO = (184, 146, 90)
MADEIRA = (160, 122, 85)

PHOTO_W, PHOTO_H = 400, 560


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


def crop_cover(src: Image.Image, tw: int, th: int) -> Image.Image:
    scale = max(tw / src.width, th / src.height)
    nw, nh = int(src.width * scale), int(src.height * scale)
    src = src.resize((nw, nh), Image.Resampling.LANCZOS)
    left = (nw - tw) // 2
    top = max(0, int((nh - th) * 0.12))
    return src.crop((left, top, left + tw, top + th))


def arch_mask(w: int, h: int) -> Image.Image:
    mask = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(mask)
    r = w / 2
    d.pieslice((0, 0, w - 1, w - 1), 180, 360, fill=255)
    d.rectangle((0, int(r) - 1, w, h), fill=255)
    return mask


def main() -> None:
    canvas = Image.new("RGB", (W, H), FUNDO)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(overlay)
    for x in range(0, W, 16):
        od.line([(x, 0), (x, H)], fill=(*MADEIRA, 16), width=1)
    canvas = Image.alpha_composite(canvas.convert("RGBA"), overlay).convert("RGB")
    draw = ImageDraw.Draw(canvas)

    foto = crop_cover(Image.open(FOTO).convert("RGB"), PHOTO_W, PHOTO_H)
    mask = arch_mask(PHOTO_W, PHOTO_H)
    px, py = W - PHOTO_W - 64, (H - PHOTO_H) // 2

    frame_mask = arch_mask(PHOTO_W + 8, PHOTO_H + 8)
    gold = Image.new("RGB", (PHOTO_W + 8, PHOTO_H + 8), DOURADO)
    canvas.paste(gold, (px - 4, py - 4), frame_mask)
    canvas.paste(foto, (px, py), mask)

    sparkle(draw, 88, 168, 18)

    display = font("constan.ttf", 72)
    italic = font("constani.ttf", 36)
    small = font("constan.ttf", 22)

    draw.text((72, 210), "Glow Icon", font=display, fill=TINTA)
    draw.text((72, 300), "Unhas com assinatura.", font=italic, fill=TINTA)
    draw.line((72, 372, 320, 372), fill=DOURADO, width=2)
    draw.text((72, 400), "Eduarda Vieira", font=small, fill=SUAVE)
    draw.text((72, 436), "Canaã dos Carajás - PA", font=small, fill=SUAVE)

    OUT.parent.mkdir(exist_ok=True)
    canvas.convert("RGB").save(OUT, "JPEG", quality=88, optimize=True, progressive=True)
    print(f"wrote {OUT} ({OUT.stat().st_size // 1024} KB)")


if __name__ == "__main__":
    main()
