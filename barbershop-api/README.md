# ✂️ NobleCut



![Status](https://img.shields.io/badge/status-em%20desenvolvimento-2ea44f?style=for-the-badge)

![Node.js](https://img.shields.io/badge/Node.js-API-339933?style=for-the-badge&logo=node.js&logoColor=white)

![Express](https://img.shields.io/badge/Express-REST%20API-000000?style=for-the-badge&logo=express&logoColor=white)

![SQLite](https://img.shields.io/badge/SQLite-persistência-003B57?style=for-the-badge&logo=sqlite&logoColor=white)

![JSON](https://img.shields.io/badge/JSON-comunicação-000000?style=for-the-badge&logo=json&logoColor=white)

  

---

  

## 📌 Sumário

  

- [1. Introdução](#1-introdução)

- [2. Proposta da Solução](#2-proposta-da-solução)

- [3. Requisitos Funcionais](#3-requisitos-funcionais)

- [4. Requisitos Não Funcionais](#4-requisitos-não-funcionais)

- [5. Regras de Negócio](#5-regras-de-negócio)

  

---

  

## 1. Introdução

  

O processo de agendamento em barbearias ainda depende, fortemente, de canais de comunicação direta, como mensagens, ligações ou registros manuais. Esse modelo exige que o cliente entre em contato com o estabelecimento para consultar horários, profissionais e serviços disponíveis, enquanto a barbearia precisa verificar essas informações manualmente, antes de confirmar cada atendimento. Quando a quantidade de clientes e profissionais aumenta, esse fluxo pode se tornar mais demorado, sujeito a falhas de comunicação e organizaçãp.

  

Além da dependência do atendimento manual, a ausência de um sistema centralizado pode dificultar o controle da agenda dos barbeiros, a identificação de conflitos de horário, o acompanhamento dos serviços oferecidos e a consulta do histórico de atendimentos. Cancelamentos também precisam ser controlados de maneira consistente, preservando informações importantes sobre o atendimento e sobre quem realizou a ação. Para os clientes, a falta de uma visão clara dos profissionais, serviços, preços, horários e avaliações pode tornar o processo de escolha e agendamento menos prático.

  

O problema, portanto, não está apenas em registrar um horário, mas em coordenar diferentes informações e regras que fazem parte do funcionamento da barbearia: disponibilidade dos profissionais, duração dos serviços, horário de funcionamento, conflitos de agenda, perfis de acesso, cancelamentos, confirmações e avaliações. Essas informações precisam permanecer consistentes e acessíveis tanto para clientes quanto para barbeiros e administradores.

  

A proposta apresentada aqui busca resolver esse problema, por meio de uma aplicação mobile integrada a uma API REST, centralizando o gerenciamento dos serviços e dos profissionais e permitindo que o processo de agendamento seja realizado de maneira estruturada, com regras de disponibilidade e controle de acesso aplicadas pelo sistema.

  

---

  

## 2. Proposta da Solução

  

A solução proposta consiste no desenvolvimento de uma aplicação mobile, para gerenciamento e agendamento de serviços em uma barbearia. O sistema tem como objetivo centralizar o processo de marcação de atendimentos, permitindo que clientes consultem os serviços disponíveis, conheçam os profissionais da barbearia, verifiquem seus horários disponíveis e realizem agendamentos, diretamente pelo aplicativo. Além da experiência voltada ao cliente, a solução também contempla funcionalidades destinadas aos barbeiros e à administração do estabelecimento, permitindo o gerenciamento dos profissionais, dos serviços oferecidos e da agenda de atendimentos. A aplicação será apoiada por uma API REST, responsável pelo processamento das regras de negócio, gerenciamento dos dados e comunicação entre o aplicativo mobile e o backend.

  

O público-alvo da aplicação é composto principalmente por clientes de barbearias que desejam realizar seus agendamentos de maneira prática e organizada, sem depender de comunicação direta com o estabelecimento, para consultar horários ou solicitar atendimentos. A solução também será utilizada pelos barbeiros, que poderão acompanhar seus próprios agendamentos, consultar as informações dos atendimentos e realizar cancelamentos quando necessário. Um terceiro perfil será o administrador da barbearia, responsável pelo gerenciamento dos funcionários e dos serviços oferecidos, além de possuir uma visão geral dos agendamentos realizados em determinado dia. Dessa forma, a aplicação atende tanto às necessidades dos clientes quanto às necessidades operacionais do estabelecimento.

  

Entre as principais funcionalidades planejadas está o cadastro e gerenciamento de funcionários, permitindo que o administrador registre informações dos barbeiros, como nome, dados de contato, descrição profissional, especialidades e serviços que estão habilitados a realizar. Cada funcionário possuirá um perfil que poderá ser consultado pelos clientes antes da realização do agendamento. O sistema também contará com o cadastro e gerenciamento dos serviços oferecidos pela barbearia, contendo informações como nome, descrição, duração estimada e preço. A associação entre funcionários e serviços permitirá que cada barbeiro esteja vinculado aos serviços que efetivamente realiza, evitando que um cliente selecione uma combinação incompatível durante o processo de agendamento.

  

O processo de agendamento será realizado de forma progressiva. Inicialmente, o cliente selecionará a data e um horário disponível. A aplicação apresentará os barbeiros que podem realizar atendimentos naquele período, permitindo que o cliente consulte seus respectivos perfis e selecione um profissional. Em seguida, serão apresentados os serviços disponíveis para o barbeiro escolhido, incluindo informações como duração e preço. Após a seleção do serviço, os dados pessoais do cliente, previamente armazenados em seu perfil, serão carregados automaticamente para consulta. O cliente poderá, então, revisar as informações do atendimento e confirmar o agendamento. Após a confirmação, o sistema deverá registrar o atendimento e enviar uma notificação por e-mail ao cliente e ao barbeiro, informando os dados do agendamento.

  

A disponibilidade dos horários será controlada de acordo com o funcionamento da barbearia e com os agendamentos existentes. O estabelecimento teste funcionará de segunda-feira a sábado, das 9h às 21h, não sendo permitidos atendimentos aos domingos. Os horários serão organizados em intervalos de 30 minutos, denominados slots, e a duração de cada serviço determinará a quantidade de slots ocupados pelo atendimento. Dessa forma, um serviço com duração de uma hora, iniciado às 15h, ocupará os slots correspondentes às 15h e às 15h30. O sistema também deverá verificar se o serviço escolhido pode ser completamente realizado dentro do horário de funcionamento da barbearia, impedindo, por exemplo, que um serviço de uma hora seja iniciado às 20h30. Além da disponibilidade do barbeiro, o sistema deverá verificar a disponibilidade do próprio cliente, impedindo que ele possua dois atendimentos simultâneos, mesmo que sejam realizados por profissionais diferentes.

  

Os agendamentos possuirão diferentes estados para representar seu ciclo de vida, como agendado, concluído e cancelado. Tanto o cliente quanto o barbeiro poderão cancelar um atendimento, desde que a solicitação seja realizada com pelo menos uma hora de antecedência em relação ao horário previsto para o início do serviço. O administrador, por possuir responsabilidade sobre o gerenciamento da barbearia, poderá cancelar um agendamento a qualquer momento, independentemente do prazo de antecedência. O cancelamento não deverá apagar o registro do agendamento, pois a informação deverá permanecer armazenada para fins de histórico e auditoria. O sistema registrará também a origem do cancelamento, permitindo identificar se a ação foi realizada pelo cliente, pelo barbeiro ou pelo administrador, bem como a data e o horário em que o cancelamento foi efetuado. O administrador terá acesso à agenda geral da barbearia, podendo consultar os atendimentos de determinado dia e visualizar informações como horário, cliente, barbeiro, serviço e situação do agendamento.

  

Após a realização de um atendimento, o cliente poderá registrar uma avaliação relacionada à experiência obtida com o serviço. A avaliação poderá conter uma nota e, opcionalmente, um comentário, sendo permitida apenas para atendimentos concluídos. As avaliações ficarão associadas ao respectivo atendimento e ao barbeiro responsável, permitindo que o sistema calcule a média das avaliações recebidas por cada profissional. Essa média poderá ser apresentada no perfil do barbeiro juntamente com a quantidade de avaliações realizadas, fornecendo aos clientes informações adicionais durante a escolha do profissional.

  

As principais entidades utilizadas pelo sistema serão Administrador, Cliente, Funcionário, Serviço, Agendamento e Avaliação. O Administrador será responsável pelas operações de gerenciamento da barbearia, enquanto o Cliente armazenará informações pessoais utilizadas no processo de agendamento. O Funcionário representará os barbeiros e conterá suas informações profissionais, enquanto o Serviço representará os procedimentos disponibilizados pela barbearia, incluindo sua duração e preço. O Agendamento será a principal entidade de relacionamento do sistema, associando um cliente, um funcionário, um serviço, uma data, um horário e um estado do atendimento. A Avaliação estará relacionada a um atendimento concluído e será utilizada para calcular a média de avaliações do respectivo funcionário. Também será necessária uma relação entre Funcionários e Serviços, para representar quais profissionais estão habilitados a realizar cada serviço.

  

A solução apresenta complexidade suficiente para justificar a utilização de uma API REST e de uma aplicação mobile, porque envolve diferentes perfis de usuários, entidades relacionadas, persistência de dados e regras de negócio — que precisam ser processadas pelo servidor. A disponibilidade de horários depende simultaneamente do funcionamento da barbearia, da duração do serviço, da agenda do funcionário e dos compromissos já assumidos pelo cliente. Além disso, operações como criação, alteração e cancelamento de agendamentos precisam respeitar regras específicas e manter um histórico das ações realizadas. O aplicativo mobile será responsável por oferecer uma interface para interação com essas funcionalidades, enquanto a API concentrará o acesso aos dados, as validações e as regras necessárias para garantir a consistência das operações.

  

Dessa forma, a solução não se limita a um cadastro simples, mas constitui um sistema integrado de gerenciamento de serviços e agendamentos, adequado ao objetivo proposto para a atividade.

  

---

  

## 3. Requisitos Funcionais

  

Os requisitos funcionais descrevem as funcionalidades que o sistema deverá disponibilizar aos seus diferentes usuários: clientes, barbeiros e administrador.

  

**RF01 — Cadastro de Clientes:** O sistema deverá permitir que uma pessoa realize seu próprio cadastro como cliente, informando os dados necessários para criação de sua conta. Todo cadastro realizado por meio desse fluxo deverá resultar obrigatoriamente em um usuário do tipo CLIENTE.

  

**RF02 — Gerenciamento do Perfil do Cliente:** O sistema deverá permitir que o cliente consulte e atualize seus dados pessoais. Essas informações poderão ser utilizadas para preencher automaticamente os dados necessários durante a confirmação de um agendamento.

  

**RF03 — Cadastro de Barbeiros:** O sistema deverá permitir exclusivamente ao administrador cadastrar usuários do tipo BARBEIRO e suas respectivas informações profissionais.

  

**RF04 — Gerenciamento de Barbeiros:** O sistema deverá permitir que o administrador consulte e atualize as informações dos barbeiros cadastrados.

  

**RF05 — Cadastro de Serviços:** O sistema deverá permitir que o administrador cadastre os serviços oferecidos pela barbearia, informando dados como nome, descrição, duração e valor.

  

**RF06 — Gerenciamento de Serviços:** O sistema deverá permitir que o administrador consulte, atualize ou remova serviços cadastrados.

  

**RF07 — Associação de Serviços aos Barbeiros:** O sistema deverá permitir definir quais serviços cada barbeiro está apto a realizar, possibilitando que diferentes barbeiros ofereçam conjuntos distintos de serviços.

  

**RF08 — Consulta de Barbeiros:** O sistema deverá permitir que o cliente consulte os barbeiros disponíveis, apresentando suas principais informações profissionais e os serviços realizados por cada um.

  

**RF09 — Consulta do Perfil do Barbeiro:** O sistema deverá permitir que o cliente visualize o perfil de um barbeiro, incluindo suas informações, serviços oferecidos e avaliação média, obtida a partir das avaliações realizadas por clientes.

  

**RF10 — Consulta de Horários Disponíveis:** O sistema deverá permitir que o cliente consulte os dias e horários disponíveis para realização de um atendimento, considerando os horários de funcionamento da barbearia e os agendamentos já existentes.

  

**RF11 — Realização de Agendamento:** O sistema deverá permitir que o cliente realize um agendamento, selecionando o dia e horário desejados, o barbeiro disponível naquele período e um dos serviços realizados pelo profissional escolhido.

  

**RF12 — Confirmação do Agendamento:** Antes da criação definitiva do agendamento, o sistema deverá apresentar ao cliente as informações selecionadas e seus dados pessoais para conferência e confirmação.

  

**RF13 — Consulta dos Agendamentos do Cliente:** O sistema deverá permitir que o cliente consulte seus próprios agendamentos e suas respectivas situações.

  

**RF14 — Consulta dos Agendamentos do Barbeiro:** O sistema deverá permitir que cada barbeiro consulte os atendimentos associados a ele, incluindo informações necessárias para a realização do serviço.

  

**RF15 — Consulta da Agenda Geral:** O sistema deverá permitir que o administrador consulte todos os agendamentos da barbearia em determinado dia, visualizando informações como horário, cliente, barbeiro, serviço e situação do agendamento.

  

**RF16 — Cancelamento Pelo Cliente:** O sistema deverá permitir que o cliente cancele um de seus agendamentos, respeitando as regras de antecedência estabelecidas pela barbearia.

  

**RF17 — Cancelamento Pelo Barbeiro:** O sistema deverá permitir que o barbeiro cancele um atendimento atribuído a ele, respeitando as regras de antecedência estabelecidas pela barbearia.

  

**RF18 — Cancelamento Pelo Administrador:** O sistema deverá permitir que o administrador cancele qualquer agendamento cadastrado.

  

**RF19 — Registro do Cancelamento:** Ao cancelar um agendamento, o sistema deverá manter seu registro e armazenar a origem do cancelamento, identificando se ele foi realizado pelo cliente, barbeiro ou administrador, além da data e do horário em que o cancelamento ocorreu.

  

**RF20 — Gerenciamento do Estado do Agendamento:** O sistema deverá manter o estado de cada agendamento, permitindo identificar, no mínimo, atendimentos agendados, concluídos e cancelados.

  

**RF21 — Envio de Confirmação do Agendamento:** Após a confirmação de um novo agendamento, o sistema deverá enviar uma mensagem de confirmação por e-mail, tanto para o cliente quanto para o barbeiro responsável pelo atendimento.

  

**RF22 — Avaliação do Atendimento:** O sistema deverá permitir que o cliente registre uma única avaliação para um atendimento concluído do qual tenha sido o cliente, atribuindo uma nota ao serviço realizado e podendo registrar um comentário sobre sua experiência.

  

**RF23 — Consulta das Avaliações:** O sistema deverá permitir a consulta das avaliações relacionadas aos atendimentos realizados por cada barbeiro.

  

**RF24 — Cálculo da Avaliação Média:** O sistema deverá calcular a média das notas recebidas por cada barbeiro a partir das avaliações cadastradas e disponibilizar essa informação em seu perfil.

  

**RF25 — Confirmação da Conclusão do Atendimento:** O sistema deverá permitir que o cliente marque como concluído um atendimento associado a ele, desde que o horário previsto para término do serviço já tenha sido alcançado.

  

**RF26 — Autenticação de Usuários:** O sistema deverá permitir que usuários cadastrados realizem autenticação utilizando suas credenciais, possibilitando o acesso às funcionalidades correspondentes ao seu tipo de usuário.

  

**RF27 — Solicitação de Recuperação de Senha:** O sistema deverá permitir que um usuário solicite a recuperação de sua senha por meio do endereço de e-mail associado à sua conta. Quando a solicitação for válida, o sistema deverá gerar uma credencial temporária de recuperação e encaminhar ao usuário as informações necessárias para a redefinição da senha.

  

**RF28 — Redefinição de Senha:** O sistema deverá permitir que um usuário defina uma nova senha mediante a apresentação de uma credencial de recuperação válida, não utilizada e dentro de seu período de validade.

  

---

  

## 4. Requisitos Não Funcionais

  

Os requisitos não funcionais estabelecem características técnicas e de qualidade esperadas para a solução, especialmente considerando a implementação de uma aplicação móvel integrada a uma API REST.

  

**RNF01 — Arquitetura Cliente-Servidor:** O sistema deverá possuir uma aplicação móvel responsável pela interação com o usuário e uma API REST responsável pelo processamento das regras de negócio, acesso e persistência dos dados.

  

**RNF02 — Tecnologia da API:** A API REST deverá ser desenvolvida utilizando Node.js e Express, conforme as tecnologias estabelecidas para o projeto.

  

**RNF03 — Formato de Comunicação:** A comunicação entre a aplicação móvel e a API deverá utilizar o formato JSON para o envio e recebimento de dados.

  

**RNF04 — Persistência de Dados:** Os dados necessários ao funcionamento do sistema deverão ser armazenados de forma persistente, garantindo que permaneçam disponíveis após o encerramento ou reinicialização da aplicação e da API.

  

**RNF05 — Organização da API:** A API deverá ser organizada em rotas e recursos relacionados às entidades do domínio, permitindo a realização das operações necessárias por meio dos métodos HTTP adequados, incluindo GET, POST, PUT ou PATCH e DELETE, quando aplicáveis.

  

**RNF06 — Validação de Dados:** A API deverá validar os dados recebidos antes de realizar operações de cadastro ou atualização, rejeitando requisições que contenham informações obrigatórias ausentes ou inválidas.

  

**RNF07 — Tratamento de Erros:** A API deverá possuir tratamento básico de erros e retornar códigos HTTP adequados, de acordo com o resultado das operações realizadas.

  

**RNF08 — Controle de Acesso:** O sistema deverá restringir funcionalidades de acordo com o tipo de usuário, garantindo que operações administrativas sejam realizadas somente pelo administrador e que clientes e barbeiros tenham acesso apenas às funcionalidades correspondentes aos seus papéis.

  

**RNF09 — Integridade dos Dados:** O sistema deverá preservar a consistência das relações entre clientes, barbeiros, serviços, agendamentos e avaliações, evitando registros que façam referência a entidades inexistentes.

  

**RNF10 — Usabilidade:** A aplicação móvel deverá possuir uma interface de fácil compreensão, com fluxo de navegação que permita ao usuário identificar, de maneira clara, as etapas necessárias para consultar informações, realizar agendamentos e utilizar as demais funcionalidades disponíveis para seu perfil.

  

**RNF11 — Rastreabilidade dos Cancelamentos:** As informações referentes ao cancelamento de um agendamento deverão permanecer armazenadas, possibilitando identificar seu estado, responsável pelo cancelamento, data e horário da ação.

  

---

  

## 5. Regras de Negócio

  

As regras de negócio estabelecem as restrições específicas do funcionamento da barbearia que deverão ser respeitadas independentemente da interface utilizada para acessar o sistema.

  

**RN01 — Horário de Funcionamento:** A barbearia funcionará de segunda-feira a sábado, das 09:00 às 21:00, não sendo permitida a realização de agendamentos aos domingos.

  

**RN02 — Intervalos de Agendamento:** Os horários disponíveis para início dos serviços deverão seguir intervalos de 30 minutos, como 09:00, 09:30, 10:00 e 10:30.

  

**RN03 — Duração dos Serviços:** A duração dos serviços deverá ser compatível com os intervalos de 30 minutos utilizados pelo sistema, permitindo durações como 30, 60, 90 ou 120 minutos.

  

**RN04 — Limite do Horário de Funcionamento:** Um serviço somente poderá ser agendado quando puder ser concluído até as 21:00. Dessa forma, um serviço com duração de 60 minutos, por exemplo, poderá começar no máximo às 20:00, não sendo permitido iniciá-lo às 20:30.

  

**RN05 — Disponibilidade Integral do Barbeiro:** Para que um agendamento seja realizado, o barbeiro selecionado deverá estar disponível durante todo o período necessário para execução do serviço. Um serviço de 60 minutos iniciado às 15:00, por exemplo, ocupará os intervalos das 15:00 às 15:30 e das 15:30 às 16:00.

  

**RN06 — Impedimento de Conflito do Barbeiro:** Um barbeiro não poderá possuir dois agendamentos cujos períodos de atendimento se sobreponham.

  

**RN07 — Impedimento de Conflito do Cliente:** Um cliente não poderá possuir agendamentos com horários sobrepostos, mesmo quando os atendimentos forem realizados por barbeiros diferentes.

  

**RN08 — Compatibilidade Entre Barbeiro e Serviço:** O cliente somente poderá selecionar um serviço que esteja associado ao barbeiro escolhido, não sendo permitido agendar com determinado profissional um serviço que ele não realize.

  

**RN09 — Validação do Agendamento:** Um novo agendamento somente poderá ser confirmado caso o cliente, o barbeiro e o serviço sejam válidos, o barbeiro realize o serviço selecionado, não existam conflitos de horário para o cliente ou para o barbeiro e o atendimento esteja integralmente dentro do horário de funcionamento da barbearia.

  

**RN10 — Estado Inicial do Agendamento:** Todo novo agendamento confirmado deverá ser registrado inicialmente com o estado agendado.

  

**RN11 — Estados do Agendamento:** Um agendamento deverá possuir um estado que represente sua situação no sistema, considerando, no mínimo, os estados agendado, concluído e cancelado.

  

**RN12 — Cancelamento Pelo Cliente:** O cliente somente poderá cancelar um agendamento quando faltarem pelo menos 60 minutos para o horário previsto de início do atendimento.

  

**RN13 — Cancelamento Pelo Barbeiro:** O barbeiro somente poderá cancelar um agendamento quando faltarem pelo menos 60 minutos para o horário previsto de início do atendimento.

  

**RN14 — Cancelamento pelo Administrador:** O administrador poderá cancelar um agendamento a qualquer momento, independentemente do tempo restante para o início do atendimento.

  

**RN15 — Preservação do Agendamento Cancelado:** O cancelamento não deverá excluir o registro do agendamento. O estado deverá ser alterado para cancelado, preservando o registro para histórico e auditoria.

  

**RN16 — Identificação do Responsável Pelo Cancelamento:** Todo cancelamento deverá registrar sua origem, identificando se foi efetuado pelo cliente, barbeiro ou administrador.

  

**RN17 — Registro Temporal do Cancelamento:** Todo cancelamento deverá registrar a data e o horário exatos em que a ação foi efetuada.

  

**RN18 — Liberação do Horário Após Cancelamento:** Após o cancelamento de um agendamento, o período anteriormente ocupado deverá voltar a ser considerado disponível para novos agendamentos, desde que todas as demais regras de disponibilidade sejam satisfeitas.

  

**RN19 — Avaliação Após Atendimento:** Um cliente somente poderá avaliar um atendimento quando o respectivo agendamento estiver com o estado concluído, sendo permitido avaliar apenas atendimentos dos quais ele próprio tenha sido o cliente.

  

**RN20 — Uma Avaliação por Atendimento:** Cada agendamento concluído poderá receber uma única avaliação, realizada exclusivamente pelo cliente associado ao atendimento. Após o registro da avaliação, não será permitido realizar uma nova avaliação para o mesmo agendamento.

  

**RN21 — Imutabilidade da Avaliação:** Após ser registrada, a avaliação será considerada definitiva, não podendo ser alterada ou excluída pelo cliente, pelo barbeiro ou pelo administrador.

  

**RN22 — Escala de Avaliação:** A nota atribuída a um atendimento deverá estar compreendida entre 1 e 5, podendo a avaliação também possuir um comentário opcional.

  

**RN23 — Cálculo da Média do Barbeiro:** A avaliação média apresentada no perfil do barbeiro deverá ser calculada a partir das notas das avaliações válidas associadas aos atendimentos realizados pelo profissional.

  

**RN24 — Confirmação por E-mail:** Após a criação e confirmação de um agendamento, uma confirmação deverá ser encaminhada por e-mail ao cliente e ao barbeiro responsável.

  

**RN25 — Visualização Administrativa:** O administrador poderá visualizar todos os agendamentos da barbearia, enquanto o cliente deverá visualizar somente seus próprios agendamentos e o barbeiro somente os atendimentos atribuídos a ele.

  

**RN26 — Restrição de Alteração e Remoção de Serviços:** Um serviço não poderá ser atualizado ou removido enquanto estiver associado a pelo menos um atendimento com o estado agendado. A atualização ou remoção somente será permitida quando não existirem atendimentos agendados associados ao serviço.

  

**RN27 — Conclusão pelo Cliente:** O cliente poderá marcar um de seus agendamentos como CONCLUIDO após o horário previsto para término do atendimento, desde que o agendamento ainda esteja com o estado AGENDADO.

  

**RN28 — Conclusão Automática do Atendimento:** Caso o cliente não confirme manualmente a conclusão do atendimento, o sistema deverá alterar automaticamente o estado do agendamento de AGENDADO para CONCLUIDO após transcorridas três horas do horário previsto para término do serviço. Somente agendamentos que permaneçam com o estado AGENDADO poderão ser concluídos automaticamente. Agendamentos anteriormente cancelados não deverão sofrer essa alteração de estado.

  

**RN29 — Autocadastro de Clientes:** O cadastro público de usuários deverá permitir exclusivamente a criação de contas do tipo CLIENTE. O usuário não poderá escolher ou modificar seu tipo durante o processo de autocadastro.

  

**RN30 — Cadastro de Barbeiros:** Usuários do tipo BARBEIRO somente poderão ser cadastrados por um usuário do tipo ADMINISTRADOR. Não será permitido o autocadastro como barbeiro.

  

**RN31 — Cadastro de Administradores:** Não haverá cadastro público de usuários do tipo ADMINISTRADOR. O administrador inicial deverá ser previamente configurado no sistema, não sendo permitida a criação de uma conta administrativa por meio do fluxo convencional de cadastro.

  

**RN32 — Proteção do Tipo de Usuário:** A API deverá determinar o tipo da conta de acordo com o fluxo de cadastro utilizado. Requisições de autocadastro não poderão criar usuários dos tipos BARBEIRO ou ADMINISTRADOR, ainda que esses valores sejam enviados diretamente à API.

  

**RN33 — Recuperação Vinculada ao Usuário:** A recuperação de senha somente poderá ser realizada para uma conta previamente cadastrada no sistema e deverá estar vinculada ao usuário correspondente ao endereço de e-mail informado na solicitação.

  

**RN34 — Credencial Temporária de Recuperação:** Cada solicitação válida de recuperação de senha deverá gerar uma credencial temporária e individual, vinculada ao usuário que realizou a solicitação.

  

**RN35 — Validade da Recuperação de Senha:** A credencial utilizada para recuperação de senha deverá possuir um período limitado de validade (10 minutos). Após sua expiração, ela não poderá mais ser utilizada para redefinir a senha, sendo necessária uma nova solicitação de recuperação.

  

**RN36 — Utilização Única da Credencial:** Uma credencial de recuperação poderá ser utilizada apenas uma vez. Após a redefinição bem-sucedida da senha, a credencial utilizada deverá ser considerada inválida.

  

**RN37 — Armazenamento Seguro da Credencial de Recuperação:** A credencial de recuperação não deverá ser armazenada em sua forma original. O sistema deverá persistir somente uma representação segura da credencial, de maneira semelhante ao tratamento aplicado às senhas dos usuários.

  

**RN38 — Armazenamento Seguro da Nova Senha:** Após uma redefinição de senha bem-sucedida, a nova senha deverá substituir a senha anterior do usuário e ser armazenada exclusivamente por meio de uma representação segura baseada em hash. Senhas em texto puro não deverão ser persistidas.

  

**RN39 — Invalidação de Recuperações Anteriores:** Após uma redefinição de senha bem-sucedida, outras credenciais de recuperação ainda válidas pertencentes ao mesmo usuário deverão ser invalidadas, impedindo que uma solicitação anterior seja utilizada posteriormente.

  

---
