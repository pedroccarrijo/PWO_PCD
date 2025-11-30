# APL PCD Frontend

Frontend React para o sistema APL PCD API.

## Instalação

```bash
npm install
```

## Execução

```bash
npm run dev
```

## Funcionalidades

- ✅ Cadastro de candidatos
- ✅ Cadastro de empresas  
- ✅ Cadastro de vagas
- ✅ Listagem de candidatos
- ✅ Listagem de vagas
- ✅ Exclusão de registros

## Tecnologias

- React 18
- TypeScript
- Vite
- Axios

## Estrutura

```
src/
├── components/     # Componentes React
├── services/       # Serviços de API
├── types/          # Tipos TypeScript
├── App.tsx         # Componente principal
└── main.tsx        # Ponto de entrada
```

O frontend se conecta automaticamente com o backend na porta 3000 através do proxy configurado no Vite.