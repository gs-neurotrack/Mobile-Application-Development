

# 🧠 **NeuroTrack – Sistema de Monitoramento e Predição de Estresse Digital**

### 📌 **Projeto desenvolvido como solução acadêmica FIAP – Global Solution**

### Tecnologias: *React Native • Java Spring Boot • C# .NET • Python FastAPI • Oracle DB • Docker • OCI*

---

## 📚 **Sumário**

1. [Visão Geral do Projeto](#-visão-geral-do-projeto)
2. [Objetivo da Solução](#-objetivo-da-solução)
3. [Arquitetura Completa](#-arquitetura-completa)
4. [Fluxo de Funcionamento](#-fluxo-de-funcionamento)
5. [Tecnologias Utilizadas](#-tecnologias-utilizadas)
6. [APIs do Projeto](#-apis-do-projeto)
7. [Modelagem do Banco Oracle](#-modelagem-do-banco-oracle)
8. [Aplicativo Mobile (React Native)](#-aplicativo-mobile-react-native)
9. [Biblioteca de Gráficos](#-biblioteca-de-gráficos)
10. [Como Executar o Projeto](#-como-executar-o-projeto)
11. [Endpoints Principais](#-endpoints-principais)
12. [Telas do Aplicativo](#-telas-do-aplicativo)
13. [Autenticação & Segurança](#-autenticação--segurança)
14. [Predição com IA](#-predição-com-ia-python)
15. [Docker & Deploy](#-docker--deploy)
16. [Futuras Implementações](#-futuras-implementações)

---

# 🧠 Visão Geral do Projeto

O **NeuroTrack** é uma plataforma completa para monitoramento, análise e previsão de estresse digital em colaboradores dentro de empresas.

Ele detecta sinais como:

✔ Horas de trabalho
✔ Reuniões realizadas
✔ Cliques e toques
✔ Interações ao longo do dia
✔ Encerramento do expediente

Com base nesses dados, o sistema:

* Calcula um **Score de Estresse Diário**
* Gera **Recomendações Automáticas**
* Faz **Predições Futuras** com IA
* Exibe gráficos evolutivos
* Permite análise detalhada para gestores

---

# 🎯 Objetivo da Solução

### **Ajudar empresas a identificar sobrecarga digital antes que vire burnout.**

O NeuroTrack cria:

* Consciência do colaborador sobre sua saúde mental
* Painel detalhado para coordenadores
* Inteligência preditiva para tomada de decisão
* Análises comportamentais invisíveis e não invasivas

---

# 🏛 Arquitetura Completa

```
+------------------------+
| React Native App       |
| (Mobile & Web)         |
|                        |
| - Feedback diário      |
| - Score de estresse   |
| - Previsões            |
+-----------+------------+
            |
            V
+------------------------+
| API C# (.NET 9)        |
| - Crud Logs            |
| - Scores               |
| - Predictions          |
| - HATEOAS              |
+-----------+------------+
            |
            V
+------------------------+
| Java Spring Boot       |
| - Auth/Login JWT       |
| - Cadastro usuário     |
| - Limites              |
| - Perfis e Permissões  |
+-----------+------------+
            |
            V
+------------------------+
| Python FastAPI         |
| - IA do Score          |
| - IA da Predição       |
| - Cálculos automáticos |
+-----------+------------+
            |
            V
+------------------------+
| Banco Oracle           |
| - GS_SCORES            |
| - GS_PREDICTIONS       |
| - GS_LIMITS            |
| - Todas as entidades   |
+------------------------+
```

---

# 🔄 Fluxo de Funcionamento

1️⃣ **Usuário abre o app (React Native)**
2️⃣ **Faz login → Java entrega JWT**
3️⃣ **Durante o dia o app coleta dados**
4️⃣ **Ao encerrar o expediente → envia para API Python**
5️⃣ **Python calcula score e previsão**
6️⃣ **C# salva score e prediction no Oracle**
7️⃣ **App exibe gráfico, média, última previsão, etc**
8️⃣ **Gestor pode acessar ANÁLISE COMPLETA (ScoresAdmin)**

---

# 🛠 Tecnologias Utilizadas

### Frontend

* React Native (Expo)
* react-native-chart-kit
* AsyncStorage
* Expo Router
* SVG Transformer

### Backend

* Java Spring Boot 3
* .NET 9 Web API (HATEOAS)
* Python FastAPI + IA

### Banco de Dados

* Oracle Database (cloud)

### Infra

* Docker
* Oracle Cloud Infrastructure (OCI)
* Linux Ubuntu Server

---

# 🧩 APIs do Projeto

### 🔹 **1. Java Spring Boot API (porta 8080)**

* Login / Auth
* Cadastro de usuário
* Limites
* Perfis
* JWT

### 🔹 **2. C# .NET API (porta 5162)**

* GsDailyLogs
* GsScores
* GsPredictions
* HATEOAS
* Busca paginada
* Pesquisa com filtros

### 🔹 **3. Python FastAPI (porta 8000)**

* Recebe payload do mobile
* Calcula score do dia
* Gera previsão futura (modelo IA)
* Retorna ao .NET salvar no BD

---

# 🗄 Modelagem do Banco Oracle

Tabelas principais:

| Tabela             | Função                         |
| ------------------ | ------------------------------ |
| **GS_SCORES**      | Score diário calculado pela IA |
| **GS_PREDICTIONS** | Previsão futura de estresse    |
| **GS_DAILY_LOGS**  | Coleta bruta de dados do app   |
| **GS_LIMITS**      | Limites de horas/reuniões      |
| **GS_ROLE**        | Perfis de acesso               |
| **GS_USER**        | Informações do colaborador     |

---

# 📱 Aplicativo Mobile (React Native)

Funcionalidades:

* Login
* Cadastro com validações
* Coleta automática de uso (UsageTracker)
* Envio de logs para IA
* Lista de usuários (modo coordenador)
* Tela Scores
* Tela ScoresAdmin
* Tela Sobre o NeuroTrack
* UI no tema **dark premium**
* Ícones Ionicons
* Linha de média nos gráficos

---

# 📊 Biblioteca de Gráficos

Usada no app:

### ✔ **react-native-chart-kit**

Recursos utilizados:

* LineChart
* Bezier curves
* Linha de média manual
* Labels customizadas
* Cores personalizadas
* Responsividade automática

Código base:

```tsx
import { LineChart } from 'react-native-chart-kit';
```

---

# ▶ Como Executar o Projeto

## 🟧 1) Rodar o App React Native
- TODAS AS APIS ESTÃO RODANDO NO DOCKER
---

## 🟩 2) Rodar o App React Native

```bash
npm install --force
npx expo start
```

Quando o QR Code aparecer no terminal ou no navegador, **NÃO** abra o app em:

❌ Android Emulator (Não conseguimos testar se funciona)
❌ iOS Simulator  (Não conseguimos testar se funciona)
❌ Web (`w`) (Não funciona)

Esses modos não funcionam corretamente porque:

### ⚠ O app só coleta cliques, toques e interações reais quando está rodando **em um aparelho físico**.

Isso acontece porque o **UsageTracker** depende do sistema de touch events nativo do celular. Em emuladores e no modo web, os eventos são filtrados, reduzidos ou até ignorados — o que prejudica a coleta de dados do sistema.

---

## ✔ Como rodar corretamente no celular

1. Instale o **Expo Go** no seu smartphone:

   * Android: Google Play
   * iOS: App Store

2. Abra o Expo Go

3. Escaneie o QR Code exibido após rodar:

```bash
npx expo start
```

4. O app inicia no seu celular e **todos os eventos reais** (toques, swipes, cliques, taps, duplo clique, tempo de tela) são capturados com precisão.

---

## 📌 Por que precisa ser no Expo Go?

O módulo `GlobalTouchTracker` e o `UsageTracker` funcionam assim:

* Interceptam **touches reais no touchscreen**
* Contam cliques e double-clicks
* Registram tempo de uso ativo do app
* Identificam finalização do expediente para enviar o DailyLog

Essas informações são **fundamentais para o cálculo de estresse** e só funcionam:

### ✔ Em um celular físico

### ✔ Rodando via Expo Go

### ✔ Com o usuário realmente tocando na tela

Qualquer outro ambiente invalida a coleta.

---

# 🔑 Logins de Teste (para Professores & Avaliadores)

Para facilitar a avaliação do projeto, disponibilizamos diversos usuários já cadastrados no sistema, incluindo colaboradores e coordenadores.

### 👨‍💼 Coordenador (acesso ao botão “Buscar Usuário”)

Para acessar o modo administrador e visualizar os dados de outros colaboradores:

```
Senha do botão “Buscar Usuário”: admin123
```

---

# 👥 Credenciais para Teste

Você pode usar qualquer um dos usuários abaixo para testar login, geração de score, previsões e visualização no dashboard:

| Nome                  | Email                             | Senha        |
| --------------------- | --------------------------------- | ------------ |
| Luana Carolina        | `luana.carolina@gmail.com`        | `luana123`   |
| Gabriel Bortoletto    | `gabriel.bortoletto@gmai.com`     | `gabi123`    |
| Max Verstapen         | `max.verstapen@gmai.com`          | `max123`     |
| Pedro Souza           | `pedro.souza669@gmail.com`        | `pedrosouza` |
| Francisco Albuquerque | `francisco.albuquerque@gmail.com` | `francisco`  |
| Gustavo Pereira       | `gustavo.pereira@gmail.com`       | `gustavo`    |
| Maria Lopes           | `maria.lopes@gmail.com`           | `maria123`   |
| Júlia Vasconcellos    | `julia.vasconcellos@gmail.com`    | `julia123`   |
| Gabriela Perlin       | `gabriela.perlin@gmail.com`       | `gabi123`    |
| Sérgio Alcantra       | `sergio.alcantra@gmail.com`       | `sergio123`  |

🚨 TAMBÉM É POSSÍVEL CRIAR UM NOVO USÁRIO NA TELA DE CADASTRO, OS USUÁRIO ACIMA ESTÃO COM DADOS, FORAM DISPONIBILIZADOS PARA FACILITAR

---

# 🧭 Sobre o botão “Buscar Usuário” (Modo Coordenador)

Essa funcionalidade permite acessar a visualização administrativa do sistema **ScoresAdmin**, onde o coordenador pode:

* Ver histórico de estresse de qualquer colaborador
* Ver previsões futuras (IA)
* Comparar evolução dos scores
* Identificar colaboradores em risco

🔐 **Esse menu só é liberado quando a senha `admin123` é informada.**

Ele **não depende do login**, ou seja:

* O coordenador loga normalmente como qualquer usuário
* Ao clicar em “Buscar Usuário”, ele informa a senha
* Se estiver correta, abre a tela com **todos os colaboradores**
* Ele seleciona um usuário para ver detalhes avançados


---


# 🚀 Endpoints Principais

### 🔹 Login

```
POST /auth/login
```

### 🔹 Buscar Scores

```
GET /api/GsScores/search?idUser=26&sortBy=idScores&sortDir=asc
```

### 🔹 Buscar Predictions

```
GET /api/GsPredictions/search?idUser=26&sortBy=idPrediction&sortDir=asc
```

### 🔹 Inserir DailyLog (mobile → Python)

```
POST /calculate-score
```

---

# 📺 Telas do Aplicativo

### ✔ Login

### ✔ Registrar

### ✔ Perfil

### ✔ Menu

### ✔ Scores (colaborador)

* Gráfico evolutivo
* Linha de média
* Último score
* Legendas
* Interpretação do score

### ✔ ScoresAdmin (coordenador)

* Histórico completo
* Última previsão
* Análise textual da IA

### ✔ ListUsers (modo coordenador)

* Paginação
* Filtro por ID ≥ 31
* Selecionar colaborador para análise

### ✔ Sobre o NeuroTrack

* Explicação do projeto
* Objetivo
* Arquitetura
* Funcionamento

---

# 🔐 Autenticação & Segurança

O projeto usa:

* JWT Token
* Validação no Mobile
* Persistência com AsyncStorage
* Roles:

  * Coordenador
  * Colaborador

APIs protegidas exigem:

```http
Authorization: Bearer <token>
```

---

# 🤖 Predição com IA (Python)

O Python FastAPI:

* Recebe o DailyLog do app
* Processa:

  * Cliques
  * Horas trabalhadas
  * Reuniões
* Calcula:

  * Score de Estresse (0 a 100)
  * Predição futura
* Salva no Oracle via C#
* Retorna JSON estruturado

Modelo simplificado:

```python
stress = (workHours * 2) + meetings + (clicks / 50)
```

---

# 🐳 Docker & Deploy

Cada API possui sua imagem:

* **project-neuro-track-py:1.0**
* **project-neuro-track-cs:2.0**
* **project-neuro-track-java:2.0**

Subindo no servidor OCI:

```bash
docker pull devpedrosena1/project-neuro-track-py:1.0
docker run -d -p 8000:8000 --restart always
```

---



# 📌 Conclusão

O **NeuroTrack** é uma solução completa para monitoramento e prevenção de estresse, combinando:

✔ Dados comportamentais reais
✔ Inteligência artificial
✔ Painéis analíticos
✔ Aplicativo moderno e responsivo
✔ Integração com múltiplas APIs
✔ Arquitetura robusta e escalável

É um dos projetos mais completos possíveis dentro da FIAP Global Solution.


| Nome                                  | Função no Projeto          | LinkedIn | GitHub |
|---------------------------------------|----------------------------|----------|--------|
| Cleyton Enrike de Oliveira            | Desenvolvedor .NET & IOT   | LinkedIn | @Cleytonrik99 |
| Matheus Henrique Nascimento de Freitas| Desenvolvedor Mobile & DBA | LinkedIn | @MatheusHenriqueNF |
| Pedro Henrique Sena                   | Desenvolvedor Java & DevOps| LinkedIn | @devpedrosena1 |
