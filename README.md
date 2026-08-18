# silly-sounds
Sounds for testing my soundplayer repo

Regenerate a folder's manifest after adding sounds:

```sh
node generate-manifest.js roblox
```

The script preserves an existing `title:` line and replaces the remainder with
the folder's audio files, sorted by name.
