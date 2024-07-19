# 🩺 Vaci_Agendar

Bem-vindo ao repositório do **Vaci_Agendar**! Este projeto é um sistema de agendamento de vacinas, projetado para facilitar a marcação e gerenciamento de horários para a vacinação contra COVID-19.

## 🚀 Instalando o Vaci_Agendar

Para instalar o **Vaci_Agendar_Back**, siga estas etapas:

### 1. Baixando o Repositorio [LiszUehara](https://github.com/LiszUehara/vaci_agendar-back.git):
```bash
     git clone
        https://github.com/LiszUehara/vaci_agendar-back.git
```
### 2. Instale as dependências


#### Usando [npm](https://github.com/npm/cli):
```bash
     npm install
```


### 3. Preencher .env de acordo com .env.example

```plaintext
    PORT=4462

    DATABASE_URL="postgresql://postgres.zaaoaibcbohzsomkdmsj:8BEUomHFzfDpeGCt@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

    DIRECT_URL="postgresql://postgres.zaaoaibcbohzsomkdmsj:8BEUomHFzfDpeGCt@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

### 3. Passo as dependências
1. Executando com  [yarn](https://github.com/yarnpkg/yarn)
    
```bash
      yarn dev
```

2. Executando com [npm](https://github.com/npm/cli):
```bash
      npm run dev
```
### 4. Prisma visualização

```bash

    yarn prisma:studio

```
  
## 🛠️ Funcionalidades

✅ **Alta demanda de vacinação**: Desenvolver soluções para gerenciar o grande número de pacientes que necessitam da vacina contra COVID-19. Porém só são permitidos 20 agendamentos por dia. 

✅ **Controle de Agenda**: Somente são permitidos dois agedamentos por hora 

✅ **Ordenação e Controle**:
  - 🔍 Implementar a ordenação por ordem de agendamento para melhorar o controle do histórico e dos pacientes que utilizam o serviço.
  - 🔍 **Pesquisa por CPF**: A pesquisa de registros é feita por CPF.


✅**Método `index`**

- **Descrição**: Recupera uma lista de agendamentos com base no valor de ordenação e na pesquisa por CPF do paciente.
- **Parâmetros**:
  - `orderValue`: Tipo de ordenação, podendo ser `"asc"` (ascendente) ou `"desc"` (descendente).
  - `searchValue`: CPF do paciente para filtrar os agendamentos.
- **Retorno**: 
  - **Total de agendamentos**: Número total de agendamentos.
  - **Lista de agendamentos**: Agendamentos filtrados e ordenados conforme os critérios fornecidos.


✅  **Método `store`**

- **Descrição**: Adiciona um novo agendamento ao banco de dados, após validar os dados e verificar a disponibilidade.
- **Parâmetros**:
  - `schedule`: Dados do agendamento a ser criado.
- **Retorno**: 
  - **Sucesso**: Mensagem de sucesso e dados do novo agendamento.
  - **Erro**: Mensagem de erro em caso de falha.

✅ **Método `update`**

- **Descrição**: Atualiza um agendamento existente, verificando a disponibilidade e a validade dos dados.
- **Parâmetros**:
  - `id`: ID do agendamento a ser atualizado.
  - `scheduleUpdated`: Dados atualizados do agendamento.
- **Retorno**: 
  - **Atualização bem-sucedida**: Dados do agendamento atualizado.
  - **Erro**: Mensagem de erro em caso de falha.


✅ **Método `getOne`**

- **Descrição**: Recupera um agendamento específico pelo ID.
- **Parâmetros**:
  - `id`: ID do agendamento a ser recuperado.
- **Retorno**: 
  - **Dados do agendamento**: Informações do agendamento ou mensagem de erro em caso de falha.


✅ **Método `delete`**

- **Descrição**: Exclui um agendamento e, se necessário, exclui o paciente associado.
- **Parâmetros**:
  - `id`: ID do agendamento a ser excluído.
- **Retorno**: 
  - **Exclusão bem-sucedida**: Dados do agendamento excluído.
  - **Erro**: Mensagem de erro em caso de falha.

## 🧪 Testes

Esta seção fornece informações sobre como executar os testes para o projeto **Vaci_Agendar**, além de exemplos e ferramentas utilizadas.

- **[Jest](https://jestjs.io/)**: Um framework de testes em JavaScript para garantir que o código está funcionando conforme o esperado.


### 🏃 Executando os Testes

Para executar os testes, siga estas etapas:

1. **Instale as dependências** (se ainda não o fez):
    ```bash
    $ npm install
    ```

2. **Execute os testes com Jest**:
    ```bash
    $ npm test
    ```

   Ou, se estiver usando Yarn:
    ```bash
    $ yarn test
    ```

## 🗄️ Banco de dados

### 💾 Introdução

### 🛢️ O Que São o Prisma e o Supabase?

O Prisma é uma ferramenta moderna de ORM facilita a interação com bancos de dados relacionais.
O Supabase é uma plataforma que oferece um banco de dados PostgreSQL como serviço. 


### 🚀 Vantagens da Integração

Integrar o Prisma com Supabase oferece várias vantagens:

- 🚀 **Facilidade de Uso**: O Prisma fornece uma API clara e concisa para interagir com o banco de dados, tornando o gerenciamento de dados mais simples e intuitivo.

- 🚀 **Segurança**: O Prisma inclui funcionalidades para garantir a integridade dos dados e segurança, reduzindo o risco de erros e vulnerabilidades.

- 🚀  **Eficiência**: Com o Prisma, você pode otimizar suas consultas e operações de banco de dados, de forma online sem precisar do Postgres na maquina local o que é util para o desafio.

- 🚀 **Desenvolvimento Ágil**: A integração com o Supabase e o Prisma acelera o desenvolvimento ao fornecer uma camada abstraída para interagir com o banco de dados.

###  🏁 Conclusão

Integrar o Prisma ORM com o Supabase é uma maneira eficiente e moderna de gerenciar dados em um banco de dados PostgreSQL. Essa abordagem foi usada no projeto para simplificar a integração com o banco de dados, evitando a necessidade de configurar e manter um banco de dados local para o avaliador.


Para usar necessario configurar o .env
Para consulta ele pode usar o prisma studio.

---

---
<br>
Desenvolvido com paixão por <strong>Ianca Lisandra Uehara Xavier</strong>.

<br>


---
---


## 💬 Contato

-  📧 **Email**: [ueharalisandra@gmail.com](ueharalisandra@gmail.com)
-  💬 **Slack**: Lisandra Uehara

