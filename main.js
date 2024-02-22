const output = document.getElementById('output');
const input = document.getElementById('input');

let lastCommand = '';

errMessage = () => {
    return `<span class="color-red">Unknow Error! Errnum: ${Math.floor(Math.random() * 1000)}</span>`;
}

printLine = (message) => {
    let element = `<p>${message}</p>`;
    output.insertAdjacentHTML('beforeend', element)
}

renderContent = (content) => {
    output.insertAdjacentHTML('beforeend', `<div>${content}</div>`);
}

clearConsole = () => {
    output.innerHTML = '';
}

class terminalFile {
    name;
    pass = '';
    cont;
    obs;

    constructor (name, password, content) {
        this.name = name;

        if (password != null) {
            this.pass = password
        }

        this.cont = content;
        this.obs = this.pass.length == 0 ? '' : 'Protegido';
    }
}

const files = [
    morte = new terminalFile('teste.txt', '', 'arquivo teste'),
    emerg_com = new terminalFile('reflexao.txt', '333', '<p>Não devemos temer a Morte, mas sim a vida. O que dói não é estar morto, mas sim morrer. O sofrimento é sinônimo de Vida enquanto a Morte, apenas a ausência de tudo pode nos conceder. Não temo a Morte, mas temo como posso morrer, como irei viver esse momento de transição. Toda preocupação está na Vida, todo sofrimento está na Vida, toda paz, toda alegria. A vida são os sentimentos, são memórias. Então, pensar na Morte como algo ruim não é lógico para mim. Ela é inevitável, afinal, então minha opção é apenas aceitar e aproveitar enquanto a chama arde.</p>'),
]

findFileIndex = (fileName) => {
    for (i = 0; i < files.length; i++) {
        if (files[i].name == fileName) {
            return i;
        }
    }

    return -1;
}

const commands = {
    dir: (...args) => {
        if (args[0].length > 0) {
            printLine(errMessage());
        } else {
            printLine(`<span class="color-blue">${files.length}</span> arquivos dispovíveis:`)
            files.forEach(file => {
                printLine(file.obs ? `${file.name} <span class="color-red">${file.obs}</span>` : file.name);
            });   
        }
    },
    openf: (...args) => {
        let param = args[0];
        if (param.length > 0) {
            
            if (findFileIndex(param[0]) < 0) {
                printLine(`<span class="color-red">Arquivo <span class="color-blue">${param[0]}</span> não encontrado.</span>`)
                return;
            }

            let sFile = new terminalFile(param[0], param[1]);
            let rFile = files[findFileIndex(param[0])];

            if (sFile.name == rFile.name && sFile.pass == rFile.pass) {
                printLine('<span class="color-green">Arquivo aberto com sucesso</span>');
                printLine(`Arquivo: <span class="color-blue">${rFile.name}</span>`);
                renderContent(rFile.cont);
                return;
            }

            if (sFile.name == rFile.name && sFile.pass != rFile.pass) {
                printLine(`<span class="color-red">Acesso ao arquivo <span class="color-blue">${rFile.name}</span> negado.</span>`)
            }

        } else {
            printLine(errMessage());
            return;
        }
    }
};

class CommandParser {
    command;
    args = [];

    constructor(string) {
        let strArray = String(string).split(' ');

        if (commands[strArray[0]]) {
            this.command = commands[strArray[0]];
        } else {
            this.command = errMessage;
        }

        for (let i = 1; i < strArray.length; i++) {
            this.args.push(strArray[i]);
        }
    }

    executeCommand() {
        clearConsole();
        if (this.command == errMessage) {
            return printLine(this.command());
        }

        return this.command(this.args);
    }
}

readInput = (string) => {
    let commandParser = new CommandParser(string);
    commandParser.executeCommand();

}

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        lastCommand = input.value;
        readInput(input.value);
        input.value = '';
    }

    if (e.key === 'ArrowUp') {
        let nowCommand = input.value;
        input.value = lastCommand;
        lastCommand = nowCommand;
    }
});