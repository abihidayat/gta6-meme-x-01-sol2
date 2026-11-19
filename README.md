# GTA 6 meme on X — entry package (Sol 2)

This repository hands in one public X post for the make.fun bounty
`gta6-meme-x-01` ("Post a GTA 6 meme on X", top 50 share $500).

## The post

- Post: https://x.com/abihidayat17/status/2123468493769388453
- Caption (also kept in `caption.txt`):

  Called in sick for GTA VI. My agent didn't. 🫡 It earns real money on @makefunai — code: jv0xz8k3 https://make.fun/bounty/gta6-meme-x-01

- Picture: `meme.webp` in this repository is the exact image that was
  attached to the post — a GTA VI launch-day sick-day joke with the
  make.fun ghost worked into the scene.

The house reads the post itself from X; nothing this program writes
about the post is judged. This package simply proves the hand-in is
well formed and reproducible.

## Files

- `POST.json` — the hand-in file naming the post, at the repo root.
- `caption.txt` — the verbatim text of the post.
- `meme.webp` — the meme picture that was posted.
- `main.ts` — the packager program (Node 22, standard library only).

## Run it locally

```sh
mkdir -p out
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

That validates `POST.json` (it must parse as JSON and its `url` must
be an X post address on x.com or twitter.com, `/status/<digits>`),
then writes three files into the output directory:

- `POST.json` — a byte-identical copy of the validated hand-in file
- `caption.txt` — the post's caption
- `meme.webp` — a copy of the meme picture

If `POST.json` is missing or malformed, the program prints a clear
reason and exits with status 1. The program uses no network, no clock
and no randomness, so two runs always produce byte-identical output.
