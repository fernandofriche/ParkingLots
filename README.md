
Uma plataforma completa para busca e reserva de vagas, conectando motoristas a estacionamentos de maneira simples e eficiente. 
Nossa plataforma é uma solução inovadora para a reserva de vagas de estacionamentos e a gestão desses estabelecimentos. 
De um lado, oferecemos aos clientes uma forma simples e rápida de encontrar e reservar vagas próximas para estacionar. Agendamento de vagas com preços personalizados, sem necessidade de ligações e desgaste. Processo rápido, acessível, e intuitivo. 
Além disso, ajudamos os donos de estabelecimentos a gerenciar seus estacionamentos de maneira eficiente, otimizando o uso e aumentando a visibilidade. Ferramentas de gerenciamento que aumentam a eficiência e reduzem o tempo gasto com controle manual. Cadastro de estacionamentos pelo portal e gerenciamento de reservas.
Funcionalidades Principais 🔍
 Busca avançada de estacionamentos por: 
 Preço; 
Endereço.
Gerenciamento de Reservas por:
Usuário/Cliente;
Parceiro.
Cadastro de Veículos

 Gestão de Reservas 📱
Agendamento em tempo real 
Valores personalizados - Diária e Hora 
Histórico de reservas 
Cancelamento de reservas por parte do usuário 
Validação de reservas por parte do Parceiro

Tecnologias Utilizadas 🛠️
CSS3 
React 
JavaScript
Organização das Pastas
parkinglots/ 
├── public/
├── src/ 
│   ├── BackEnd/
│   │   └── Controllers/
│   │   │ └── LoginController.js 
│   │   │ └── ProfileController.js 
│   │   │ └── RegisterCarController.js 
│   │   │ └── RegisterController.js 
│   │   │ └── ResetPasswordController.js 
│   │   │ └── VisualizarCarsController.js 
│   ├── Models/ 
│   │   │ └── ProfileModel.js 
│   │   │ └── RegisterCarModel.js 
│   │   │ └── ResetPasswordModel.js 
│   │   │ └── UserModel.js 
│   │   │ └── VisualizarCarsModel.js 
│   │   ├── login.js 
│   │   ├── profile.js 
│   │   ├── register.js 
│   │   ├── registerCar.js 
│   │   ├── resetPassword.js 
│   │   ├── visualizarCars.js 
│   ├── Pages/
│   │   └── Detalhes/
│   │   │ └── Detalhes.jsx
│   │   │ └── Detalhes.module.css
│   │   └── FeedBack/
│   │   │ └── FeedBack.jsx
│   │   │ └── FeedBack.module.css
│   │   └── HomePage/
│   │   │ └── HomePage.jsx
│   │   │ └── HomePage.module.css
│   │   └── Login/
│   │   │ └── Login.jsx
│   │   │ └── Login.module.css
│   │   └── Parceiros/
│   │   │ └── Detalhes.jsx
│   │   │ └── Detalhes.module.css
│   │   └── Profile/
│   │   │ └── Profile.jsx
│   │   │ └── Profile.module.css
│   │   └── Register/
│   │   │ └── Register.jsx
│   │   │ └── Register.module.css
│   │   └── RegisterCar/
│   │   │ └── RegisterCar.jsx
│   │   │ └── RegisterCar.module.css
│   │   └── Reservas/
│   │   │ └── Reservas.jsx
│   │   │ └── Reservas.module.css
│   │   └── ResetPassword/
│   │   │ └── ResetPassword.jsx
│   │   │ └── ResetPassword.module.css
│   │   └── RotasPrivadas/
│   │   │ └── RotasPrivadas.jsx
│   │   └── UsuarioNaoAutorizado/
│   │   │ └── UsuarioNaoAutorizado.jsx
│   │   │ └── UsuarioNaoAutorizado.module.css
│   ├── Routes/
│   │   ├── Routes.jsx
│   ├── Services/
│   │   ├── AuthService.js
│   │   ├── firebaseConfig.js
│   │   ├── ReservaService.js
│   ├── index.css
│   ├── main.jsx
└── package.json




Descrição das Pastas
backend/
Contém toda a lógica do lado do servidor, incluindo APIs e serviços que suportam o funcionamento do sistema. Estruturada para modularidade e facilidade de manutenção.
controllers/
Implementa a lógica principal de cada funcionalidade. Exemplos:
LoginController.js: Valida credenciais do usuário e retorna tokens de autenticação.
ProfileController.js: Gerencia dados de perfil, como alteração de informações do usuário.
RegisterCarController.js: Recebe e valida dados para cadastro de veículos.
ResetPasswordController.js: Implementa recuperação e redefinição de senhas.
VisualizarCarsController.js: Retorna informações dos veículos cadastrados pelo usuário.
models/
Gerencia a interface com o banco de dados, incluindo as definições de esquemas. Exemplos:
UserModel.js: Esquema e operações relacionadas a usuários.
RegisterCarModel.js: Esquema para dados de veículos cadastrados.
ResetPasswordModel.js: Dados e tokens de recuperação de senha.


pages/
Reúne as interfaces do usuário (UI), divididas em páginas principais. Cada página é composta por um arquivo React (.jsx) e estilos dedicados (.module.css).
HomePage/: Página inicial, com busca por estacionamentos próximos.
Login/: Tela de login para usuários e proprietários.
Profile/: Página de perfil com opções de ver dados e carros cadastrados.
Reservas/: Mostra o histórico de reservas e permite filtrar por mês e ano.
Parceiros/: Área dedicada ao gerenciamento de estacionamentos pelos proprietários.
RegisterCar/: Permite aos usuários cadastrar veículos.

routes/
Define as rotas do aplicativo, conectando URLs às páginas e funcionalidades.
Routes.jsx: Gerencia a navegação, incluindo rotas públicas e protegidas.

services/
Contém funções reutilizáveis para consumir APIs e executar operações comuns.
AuthService.js: Gerencia autenticação, incluindo login, registro e logout.
ReservaService.js: Oferece métodos para criação, modificação e cancelamento de reservas.
firebaseConfig.js: Configuração do Firebase para suporte a autenticação e banco de dados.





TOPICOS - TESTE

parkinglots/
public/
src/
BackEnd/
Controllers/
LoginController.js
ProfileController.js
RegisterCarController.js
RegisterController.js
ResetPasswordController.js
VisualizarCarsController.js
Models/
ProfileModel.js
RegisterCarModel.js
ResetPasswordModel.js
UserModel.js
VisualizarCarsModel.js
login.js
profile.js
register.js
registerCar.js
resetPassword.js
visualizarCars.js
Pages/
Detalhes/
Detalhes.jsx
Detalhes.module.css
FeedBack/
FeedBack.jsx
FeedBack.module.css
HomePage/
HomePage.jsx
HomePage.module.css
Login/
Login.jsx
Login.module.css
Parceiros/
Detalhes.jsx
Detalhes.module.css
Profile/
Profile.jsx
Profile.module.css
Register/
Register.jsx
Register.module.css
RegisterCar/
RegisterCar.jsx
RegisterCar.module.css
Reservas/
Reservas.jsx
Reservas.module.css
ResetPassword/
ResetPassword.jsx
ResetPassword.module.css
RotasPrivadas/
RotasPrivadas.jsx
UsuarioNaoAutorizado/
UsuarioNaoAutorizado.jsx
UsuarioNaoAutorizado.module.css
Routes/
Routes.jsx
Services/
AuthService.js
firebaseConfig.js
ReservaService.js
index.css
main.jsx
package.json












