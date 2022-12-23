### auto-update-electron

Solução para atualização automática com electron. 
Depois de enfrentar vários problemas com atualização automática de uma aplicação electron, consegui chegar na solução que funcionou.
Abaixo vou descrever os problemas enfrentados e o que tive que fazer para resolver.

Obs: Não testei para `mac`, solução apenas para `Windows` e `Linux`

[Documentação do electron-builder](https://www.electron.build)

### Objetivo

Realizar a atualização da minha aplicação electron de forma automatica assim que lançar uma nova versão.

### Compilação

- Para publicar a aplicação no github é necessário gerar um token, [aqui](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token) esta o passo a passo.
- Para que a publicação funcione é necessário adicionar uma variavel de ambiente com o nome GH_TOKEN com o seu token

após os passos acima basta executar o script para compilação e publicação. Segue um exemplo abaixo (no meu caso utilizando Linux)
- `GH_TOKEN=SEU_TOKEN_AQUI yarn package:all`

`package:all`: Windows/Linux - definido no [package.json](package.json) na sessão de scripts

_**Obs: Para publicação tem a possibilidade de informar o token no [package.json](package.json)  dentro de `"publish"`, porem tive problemas no processo de atualização, erro de autenticação com o github**_

### Problemas enfrentados

- [Linux](#linux)
- [Windows](#windows)

#### Linux

Após gerar a release e enviar para o github`yarn package:linux`, tive problema por não estar gerando o arquivo `latest-linux.yml`, e como resolvi?

No [package.json](package.json), minha config para gerar a release no git hub estava desta forma

```json
"publish": [
      {
        "provider": "github",
        "owner": "GilbertoMattos",
        "repo": "auto-update-electron",
        "private": false
      }
    ]
```
Com isso, percebi que esta tentando fazer o upload para o snap(loja de palicativos do Linux), então pensei em desabilitar, ja que não quero enviar para la

Cheguei na solução abaixo:
```json
    "publish": [
      {
        "provider": "github",
        "owner": "GilbertoMattos",
        "repo": "auto-update-electron",
        "private": false
      }
    ],
    "linux": {
      "category": "Utility",
      "publish": [
        "github"
      ]
    }
```
Defini que para linux quero publicar apenas no github, com esta alteração começou gerar o arquivo `latest-linux.yml` e a atualização automática funcionou perfeitamente(no linux)

#### Windows

Aqui a atualização automática tambem não estava acontecendo, ao verificar o log gerado na maquina no caminho especificado no `main.js`, identifiquei o seguinte erro abaixo:

```log
[2022-12-22 16:13:51.979] [info]  Versão da aplicação = 1.0.0
[2022-12-22 16:13:52.144] [info]  checking-for-update
[2022-12-22 16:13:54.547] [info]  Erro no auto-update Error: Unable to find latest version on GitHub (https://api.github.com/repos/GilbertoMattos/auto-update-electron/releases/latest), please ensure a production release exists: Error: net::ERR_CERT_AUTHORITY_INVALID
    at SimpleURLLoaderWrapper.<anonymous> (node:electron/js2c/browser_init:101:7169)
    at SimpleURLLoaderWrapper.emit (node:events:527:28)
```

para o Windows o .exe gerado precisa ser assinado utilizando um certificado, para isso gerei um certificado utilizando o próprio `electron-builder`, para mais detalhes esta descrito na [documentação](https://www.electron.build/cli), adicionei o seguinte script abaixo para isso:

`"win-cert": "electron-builder create-self-signed-cert -p fsj"`

_**Obs: este script tive que executar em uma maquina windows, pode ser que aconteça um erro, mas vai gerar o .pfx**_ 

Após gerar o .pfx adicicionar na pasta `private` dentro do projeto, verificar a config para o windows no [package.json](package.json)
```json
    "win": {
      "certificateFile": "private/fsj.pfx",
      "certificatePassword": "",
      "verifyUpdateCodeSignature": false,
      "publisherName": "fsj"
    },
```
- `certificateFile` path do certificado
- `publisherName` - mesmo nome definido ao executar o comando de geração do certificado.