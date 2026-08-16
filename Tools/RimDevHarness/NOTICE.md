# Attribution and protocol boundary

RIM Dev Harness is an independent, dependency-free client of the official OpenAI Codex App Server protocol.

The subprocess lifecycle and message-routing architecture were adapted from these official OpenAI sources:

- [Codex App Server README](https://github.com/openai/codex/blob/main/codex-rs/app-server/README.md)
- [OpenAI Codex Python SDK client](https://github.com/openai/codex/blob/main/sdk/python/src/openai_codex/client.py)
- [OpenAI Codex license](https://github.com/openai/codex/blob/main/LICENSE) — Apache License 2.0

No OpenAI package is vendored into this directory. The harness generates no replacement protocol schema: the installed `codex app-server generate-json-schema` output and the running server remain the version-specific authority.
