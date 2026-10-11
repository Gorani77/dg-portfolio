# TruckWorks editorial images

Created from the project's own Blender/glTF assets on 2026-10-11, using scripts/render_truckworks.py. No external stock imagery or generated imaginary product screenshots.

- factory-overview.png: staged factory composition, 2200 × 1400.
- forming-detail.png: ST-02 close composition, 1600 × 1200.

These are authored illustrations of the actual models, not screenshots, benchmark evidence or live production observations. The renderer uses neutral staged product poses. Captions must retain that distinction.

Reproduction (overwrites these generated PNGs):

```powershell
& 'C:\Users\sp287\.codex\tools\blender\blender-4.5.3-windows-x64\blender.exe' --background --factory-startup --python-exit-code 1 --python 'C:\Users\sp287\WebstormProjects\portfolio\scripts\render_truckworks.py' -- 'C:\project\truckworks' 'C:\Users\sp287\WebstormProjects\portfolio\public\truckworks'
```

Do not regenerate over manual artwork edits without preserving those edits first. Runtime/visual verification is pending with the user.
