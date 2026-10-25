"""Book cover generator based on story metadata (title, author, genre, tags).

Generates high-resolution (600x900) publication-ready book covers with
genre-adaptive palettes, elegant gradients, geometric ornamentation, and typography.
Uses Pillow (PIL) for 100% reliability, instant generation, and zero external API dependencies.
"""
import math
import uuid
from pathlib import Path
from typing import List, Tuple
from PIL import Image, ImageDraw, ImageFont, ImageFilter

WIDTH = 600
HEIGHT = 900

# ── Genre Palettes (top_color, bottom_color, accent_color, text_color) ────────
PALETTES = {
    "Fantasy": {
        "gradient": ((15, 23, 42), (30, 58, 138), (14, 116, 144)),
        "accent": (251, 191, 36),       # Warm gold
        "frame": (217, 119, 6),
        "text": (255, 255, 255),
        "motif": "celestial",
    },
    "Science Fiction": {
        "gradient": ((3, 7, 18), (17, 24, 39), (31, 41, 55)),
        "accent": (6, 182, 212),        # Cyan neon
        "frame": (59, 130, 246),
        "text": (240, 249, 255),
        "motif": "grid",
    },
    "Mystery": {
        "gradient": ((24, 24, 27), (39, 39, 42), (9, 9, 11)),
        "accent": (234, 179, 8),        # Amber streetlamp
        "frame": (113, 113, 122),
        "text": (250, 250, 250),
        "motif": "shadow",
    },
    "Romance": {
        "gradient": ((76, 29, 61), (131, 24, 67), (190, 24, 93)),
        "accent": (253, 224, 71),       # Soft champagne
        "frame": (244, 114, 182),
        "text": (255, 241, 242),
        "motif": "botanical",
    },
    "Adventure": {
        "gradient": ((20, 83, 45), (22, 101, 52), (67, 56, 202)),
        "accent": (245, 158, 11),       # Sunrise gold
        "frame": (34, 197, 94),
        "text": (240, 253, 244),
        "motif": "compass",
    },
    "Horror": {
        "gradient": ((10, 10, 10), (69, 10, 10), (20, 20, 20)),
        "accent": (220, 38, 38),        # Crimson blood
        "frame": (153, 27, 27),
        "text": (245, 245, 245),
        "motif": "vignette",
    },
    "Historical": {
        "gradient": ((66, 32, 6), (113, 63, 18), (41, 37, 36)),
        "accent": (217, 119, 6),        # Antique bronze
        "frame": (180, 83, 9),
        "text": (254, 243, 199),
        "motif": "classic",
    },
    "Contemporary": {
        "gradient": ((30, 41, 59), (51, 65, 85), (71, 85, 105)),
        "accent": (56, 189, 248),       # Sky blue
        "frame": (148, 163, 184),
        "text": (255, 255, 255),
        "motif": "modern",
    },
}

DEFAULT_PALETTE = PALETTES["Fantasy"]


def _draw_gradient(img: Image.Image, colors: Tuple[Tuple[int, int, int], ...]):
    """Draw a vertical multi-stop gradient background."""
    draw = ImageDraw.Draw(img)
    num_stops = len(colors)
    step_height = HEIGHT / (num_stops - 1)

    for y in range(HEIGHT):
        stop_idx = min(int(y / step_height), num_stops - 2)
        local_ratio = (y - stop_idx * step_height) / step_height
        c1 = colors[stop_idx]
        c2 = colors[stop_idx + 1]

        r = int(c1[0] + (c2[0] - c1[0]) * local_ratio)
        g = int(c1[1] + (c2[1] - c1[1]) * local_ratio)
        b = int(c1[2] + (c2[2] - c1[2]) * local_ratio)
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))


def _draw_ornaments(draw: ImageDraw.Draw, motif: str, accent: Tuple[int, int, int]):
    """Draw genre-specific decorative geometry and flourishes."""
    # Outer frame
    pad = 28
    draw.rectangle([pad, pad, WIDTH - pad, HEIGHT - pad], outline=accent, width=2)
    draw.rectangle([pad + 6, pad + 6, WIDTH - pad - 6, HEIGHT - pad - 6], outline=(*accent[:3], 120), width=1)

    # Corner cornerstones
    c_len = 24
    corners = [
        ((pad, pad), (pad + c_len, pad), (pad, pad + c_len)),
        ((WIDTH - pad, pad), (WIDTH - pad - c_len, pad), (WIDTH - pad, pad + c_len)),
        ((pad, HEIGHT - pad), (pad + c_len, HEIGHT - pad), (pad, HEIGHT - pad - c_len)),
        ((WIDTH - pad, HEIGHT - pad), (WIDTH - pad - c_len, HEIGHT - pad), (WIDTH - pad, HEIGHT - pad - c_len)),
    ]
    for origin, h, v in corners:
        draw.line([origin, h], fill=accent, width=3)
        draw.line([origin, v], fill=accent, width=3)

    cx, cy = WIDTH // 2, HEIGHT // 2 - 20

    if motif == "celestial":
        # Concentric mystic rings and stars
        for r in [90, 130, 170]:
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=(*accent, 80), width=1)
        # Center diamond star
        draw.polygon([(cx, cy - 40), (cx + 30, cy), (cx, cy + 40), (cx - 30, cy)], outline=accent, fill=(*accent, 40))

    elif motif == "grid":
        # Futuristic orbital rings
        for r in [70, 110, 150]:
            draw.arc([cx - r, cy - r, cx + r, cy + r], start=30, end=330, fill=accent, width=2)
        draw.line([(cx - 140, cy), (cx + 140, cy)], fill=(*accent, 100), width=1)
        draw.line([(cx, cy - 140), (cx, cy + 140)], fill=(*accent, 100), width=1)

    elif motif == "compass":
        # Adventure compass rose
        draw.ellipse([cx - 80, cy - 80, cx + 80, cy + 80], outline=accent, width=2)
        draw.polygon([(cx, cy - 70), (cx + 15, cy - 15), (cx, cy), (cx - 15, cy - 15)], fill=accent)
        draw.polygon([(cx, cy + 70), (cx + 15, cy + 15), (cx, cy), (cx - 15, cy + 15)], fill=(*accent, 120))
        draw.polygon([(cx - 70, cy), (cx - 15, cy - 15), (cx, cy), (cx - 15, cy + 15)], fill=(*accent, 160))
        draw.polygon([(cx + 70, cy), (cx + 15, cy - 15), (cx, cy), (cx + 15, cy + 15)], fill=(*accent, 160))

    else:
        # Classical laurel / decorative cartouche
        draw.ellipse([cx - 100, cy - 100, cx + 100, cy + 100], outline=(*accent, 120), width=2)
        draw.ellipse([cx - 60, cy - 60, cx + 60, cy + 60], outline=accent, width=1)
        draw.line([(cx - 80, cy + 120), (cx + 80, cy + 120)], fill=accent, width=2)


def _wrap_text(text: str, max_chars_per_line: int = 20) -> List[str]:
    """Wrap a title gracefully onto multiple lines."""
    words = text.split()
    lines = []
    current = []
    for w in words:
        if sum(len(x) for x in current) + len(current) + len(w) <= max_chars_per_line:
            current.append(w)
        else:
            if current:
                lines.append(" ".join(current))
            current = [w]
    if current:
        lines.append(" ".join(current))
    return lines or [text]


def generate_book_cover(
    title: str,
    author: str = "Leaf Author",
    genre: str = "Fantasy",
    tags: List[str] = None,
    output_path: Path = None,
) -> Path:
    """Generate a high-resolution book cover and save to output_path.

    Returns the absolute Path of the saved image.
    """
    palette = PALETTES.get(genre, DEFAULT_PALETTE)
    img = Image.new("RGBA", (WIDTH, HEIGHT))

    # 1. Base gradient
    _draw_gradient(img, palette["gradient"])

    # 2. Ornaments
    overlay = Image.new("RGBA", (WIDTH, HEIGHT), (0, 0, 0, 0))
    overlay_draw = ImageDraw.Draw(overlay)
    _draw_ornaments(overlay_draw, palette["motif"], palette["accent"])
    img = Image.alpha_composite(img, overlay)

    draw = ImageDraw.Draw(img)

    # 3. Fonts: try default or load system font
    try:
        font_genre = ImageFont.truetype("arial.ttf", 16)
        font_title_large = ImageFont.truetype("georgia.ttf", 36)
        font_author = ImageFont.truetype("georgia.ttf", 20)
        font_leaf = ImageFont.truetype("arial.ttf", 13)
    except IOError:
        font_genre = ImageFont.load_default()
        font_title_large = ImageFont.load_default()
        font_author = ImageFont.load_default()
        font_leaf = ImageFont.load_default()

    # 4. Genre Pill at the top
    genre_label = f"— {genre.upper()} —"
    bbox = draw.textbbox((0, 0), genre_label, font=font_genre)
    gw = bbox[2] - bbox[0]
    draw.text(((WIDTH - gw) // 2, 80), genre_label, fill=palette["accent"], font=font_genre)

    # 5. Title (center-top wrapped)
    title_lines = _wrap_text(title, max_chars_per_line=18)
    line_height = 46
    title_start_y = 130
    for i, line in enumerate(title_lines[:3]):
        bbox = draw.textbbox((0, 0), line, font=font_title_large)
        tw = bbox[2] - bbox[0]
        # Shadow for readability
        draw.text(((WIDTH - tw) // 2 + 2, title_start_y + i * line_height + 2), line, fill=(0, 0, 0, 180), font=font_title_large)
        draw.text(((WIDTH - tw) // 2, title_start_y + i * line_height), line, fill=palette["text"], font=font_title_large)

    # 6. Author name at bottom
    author_text = f"BY {author.upper()}"
    bbox = draw.textbbox((0, 0), author_text, font=font_author)
    aw = bbox[2] - bbox[0]
    draw.text(((WIDTH - aw) // 2, HEIGHT - 130), author_text, fill=palette["text"], font=font_author)

    # 7. Leaf publishing seal at very bottom
    leaf_seal = "LEAF EDITORIAL EDITION"
    bbox = draw.textbbox((0, 0), leaf_seal, font=font_leaf)
    lw = bbox[2] - bbox[0]
    draw.text(((WIDTH - lw) // 2, HEIGHT - 75), leaf_seal, fill=palette["accent"], font=font_leaf)

    # 8. Save
    if output_path is None:
        filename = f"{uuid.uuid4().hex}.png"
        output_path = Path("backend") / "uploads" / filename

    output_path.parent.mkdir(parents=True, exist_ok=True)
    # Convert RGBA to RGB for clean PNG/JPG
    rgb_img = Image.new("RGB", (WIDTH, HEIGHT), (0, 0, 0))
    rgb_img.paste(img, mask=img.split()[3])
    rgb_img.save(output_path, "PNG", quality=95)

    return output_path
