# nuii-backend

## Conventional Commit
This website follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

### format
`<type>(optional scope): <description>` 
Contoh: `feat(pre-event): add speakers section`

### type
Type yang bisa digunakan adalah:

- feat: → commits that adds new feature
- fix: → commits that fixes bugs
- refactor: → commits that rewrite/restructure your code without changing any behaviour
- style:  → commits that do not effect the meaning (white-space, formatting, missing semi-colons, etc)
- test: → commits that adds missing tests or correcting existing tests
- docs: → commits that effect documentation only
- build: → commits that effect build components (dependencies, project version, etc.)
- chore: → commits technical or preventative maintenance

### description

Description harus bisa mendeskripsikan apa yang dikerjakan.

Tambahkan BREAKING CHANGE di description apabila ada perubahan yang signifikan.

**❗jika ada beberapa hal yang dikerjakan, maka lakukan commit secara bertahap.❗**
- Setelah titik dua, ada spasi. Contoh: `feat: add something`
- Jika type `fix` langsung sebut issuenya. Contoh: `fix: file size limiter not working`
- Gunakan kata imperative, dan present tense: "change" bukan "changed" atau "changes"
- Jangan gunakan huruf kapital di awal kalimat description
- Jangan tambahkan titik di akhir description

