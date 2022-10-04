describe('Login e registro de usuario', () => {

    beforeEach(() => {
        cy.visit('https://alura-fotos.herokuapp.com')

        cy.intercept('POST', 'https://apialurapic.herokuapp.com/user/login', {
            statusCode: 400
        }).as('stubPost')
    })
    it('verifica mensagem de validacao', () => {
        cy.contains('a','Register now').click();
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage','Email is required!').should('be.visible');
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage','Full name is required!').should('be.visible');
        cy.contains('ap-vmessage','User name is required!').should('be.visible');
        cy.contains('ap-vmessage','Password is required').should('be.visible');
    })
    it('verifica mensagens de email invalido', () => {
        cy.contains('a','Register now').click();
        cy.contains('button', 'Register').click();
        cy.get('input[formcontrolname="email"]').type('Leude');
        cy.contains('ap-vmessage','Invalid e-mail').should('be.visible');   
    })
    it('verifica mensagens de nome completo', () => {
        cy.contains('a','Register now').click();
        cy.contains('button', 'Register').click();
        cy.get('input[formcontrolname="fullName"]').type('1');
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage','Mininum length is 2').should('be.visible');   
    })
    it('verifica nome de usuario', () => {
        cy.contains('a','Register now').click();
        cy.contains('button', 'Register').click();
        cy.get('input[formcontrolname="userName"]').type('1');
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage','Mininum length is 2').should('be.visible');   
    })
    it('verifica senha', () => {
        cy.contains('a','Register now').click();
        cy.contains('button', 'Register').click();
        cy.get('input[formcontrolname="password"]').type('1');
        cy.contains('button', 'Register').click();
        cy.contains('ap-vmessage','Mininum length is 8').should('be.visible');   
    })
    it('fazer login de usuario valido', () => {

        cy.login(Cypress.env('userName'), Cypress.env('passWord'))
        cy.wait('@stubPost')
        cy.contains('a', '(Logout').should('be.visible');
    })
    it('fazer login de usuario invalido', () => {
        cy.login('jack', '1234')
        cy.on('window:alert', (str) => {
            expect(str).to.equal('Invalid user name or password')
        })
    })
    
    const usuarios = require('../../fixtures/usuarios.json');
    usuarios.forEach(usuario => {
//no meu json há vários usuários, e preciso refenciar o conteúdo do usuario userName aqui (tem várias formas de fazer):
        it.only(`registra novo usuário ${usuario.userName} `, () => {
            cy.contains('a', 'Register now').click();
            cy.contains('button','Register').click();

//agora onde há esses valores fixos preciso trocar pelo conteúdo da variável
            cy.get('input[formcontrolname="email"]').type(usuario.email);
            cy.get('input[formcontrolname="fullName"]').type(usuario.fullName);
            cy.get('input[formcontrolname="userName"]').type(usuario.userName);
            cy.get('input[formcontrolname="password"]').type(usuario.password);
            cy.contains('button', 'Register').click();
    })
})

})
