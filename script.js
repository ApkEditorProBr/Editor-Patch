//Acender uma luz verde
function LuzVerde() {
  const greenDot = document.querySelector('.green-dot');

  greenDot.classList.remove('cinza');
  greenDot.classList.add('verde');

  //Aguarda 2 segundos antes de voltar ao cinza
  setTimeout(function() {
    greenDot.classList.add('cinza');
    greenDot.classList.remove('verde');
  }, 2500);
  limpar();
}

function packFiles() {
  // Obtém todos os elementos de entrada de arquivo com a classe 'file-input'
  var fileInputs = document.getElementsByClassName('file-input');
  // Cria uma nova instância da classe JSZip
  var zip = new JSZip();

  // Percorre todos os elementos de entrada de arquivo
  for (var i = 0; i < fileInputs.length; i++) {
    var files = fileInputs[i].files;

    // Percorre todos os arquivos selecionados
    for (var j = 0; j < files.length; j++) {
      var file = files[j];
      // Adiciona o arquivo ao zip utilizando o nome original como chave
      zip.file(file.name, file);
    }
  }

  // Gera o zip assincronamente
  zip.generateAsync({ type: 'blob' }).then(function(content) {
    // Obtém o elemento de link de download pelo ID
    var downloadLink = document.getElementById('downloadLink');
    // Define o href do link como o URL do conteúdo do zip
    downloadLink.href = URL.createObjectURL(content);
    // Exibe o link de download
    downloadLink.style.display = 'inline';
  });
}

function validateFile(input) {
  // Define a expressão regular para validar as extensões permitidas
  const allowedExtensions = /(\.zip)$/i;
  const file = input.files[0];
  
  // Verifica se a extensão do arquivo selecionado não está de acordo com a expressão regular
  if (!allowedExtensions.test(file.name)) {
    
    //Exibe um alerta de luz vermelha ao usuário
    
    const redDot = document.querySelector('.red-dot');

      redDot.classList.remove('cinza');
      redDot.classList.add('vermelho');

setTimeout(function() {
  redDot.classList.add('cinza');
  redDot.classList.remove('vermelho');
}, 2000);
    //Limpa o valor do arquivo selecionado
    input.value = '';
  }
}

//Limpar o conteúdo do "textarea". 
function limpar() {
  document.getElementById("editorContent").value = "";
}

const yellowDot = document.querySelector('.yellow-dot');

yellowDot.classList.remove('cinza');
yellowDot.classList.add('amarelo');

setTimeout(function() {
  yellowDot.classList.add('cinza');
  yellowDot.classList.remove('amarelo');
}, 2000);

//Função que é executada quando a janela é carregada
window.onload = function() {
  //Obtém o elemento de entrada de arquivo pelo seu ID
  const fileInput = document.getElementById('file-input');
  //Obtém o elemento do editor de texto pelo seu ID
  const editor = document.getElementById('editorContent');
  //Obtém o botão de salvar pelo seu ID
  const saveBtn = document.getElementById('save-btn');
  //Obtém o botão +1 pelo seu ID
  const addFileBtn = document.getElementById('file-label');

  //Adiciona um ouvinte de evento para quando o arquivo de entrada for alterado
  fileInput.addEventListener('change', function(event) {
    //Obtém o arquivo selecionado
    const file = event.target.files[0];
    //Cria um leitor de arquivo
    const reader = new FileReader();

    //Função que é executada quando o arquivo é lido
    reader.onload = function(e) {
      //Obtém os dados do arquivo como um ArrayBuffer
      const zipData = e.target.result;

      //Carrega o arquivo zip assincronamente
      JSZip.loadAsync(zipData)
        .then(function (zip) {
          //Percorre todos os arquivos dentro do arquivo zip
          zip.forEach(function (relativePath, file) {
            //Verifica se o nome do arquivo termina com ".txt"
            if (file.name.endsWith('.txt')) {
              //Lê o conteúdo do arquivo como texto
              file.async('text')
                .then(function (content) {
                  //Define o conteúdo do editor de texto
                  editor.value = content;
                });
            }
          });
        });
    };

    //Lê o arquivo como um ArrayBuffer
    reader.readAsArrayBuffer(file);
  });

  //Adiciona um ouvinte de evento para quando o botão de salvar for clicado
  saveBtn.addEventListener('click', function() {
    //Cria um novo arquivo zip
    const zip = new JSZip();
    //Obtém o texto do editor
    const text = editor.value;
    //Obtém o nome do arquivo de entrada, ou usa "Patch_Gerado" se não houver arquivo selecionado
    const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'Patch_Gerado'; 

    //Adiciona o texto como um arquivo no zip
    zip.file('patch.txt', text);

    // Adiciona os arquivos selecionados no zip 
    const fileInputs = document.getElementsByClassName('file-input');

    for (var i = 0; i < fileInputs.length; i++) {
      var files = fileInputs[i].files;

      for (var j = 0; j < files.length; j++) {
        var file = files[j];
        zip.file(file.name, file);
      }
    }

    //Gera o zip assincronamente
    zip.generateAsync({ type: 'blob' })
      .then(function(content) {
        //Cria um link de download
        const downloadLink = document.createElement('a');
        
        //Define o nome do arquivo de download com a extensão ".zip"
        downloadLink.download = fileName.replace('.txt', '.zip');
        //Define o href do link como o URL do conteúdo do zip
        downloadLink.href = window.URL.createObjectURL(content);
        //Clica no link de download
        downloadLink.click();
      });
  });

  //Adiciona um ouvinte de evento para quando o botão +1 for clicado
  addFileBtn.addEventListener('click', function() {
    //Cria um novo elemento de input file
    const newFileInput = document.createElement('input');
    newFileInput.type = 'file';
    newFileInput.classList.add('file-input');

    //Cria um novo label
    const newFileLabel = document.createElement('label');
    newFileLabel.htmlFor = 'file-input';
    newFileLabel.textContent = '+' + (fileInputs.length + 1);

    //Insere o novo elemento entre o botão de salvar e o botão de limpar
    const limparBtn = document.getElementsByClassName('limpar')[0];
    const parentDiv = limparBtn.parentNode;
    parentDiv.insertBefore(newFileInput, limparBtn);
    parentDiv.insertBefore(newFileLabel, limparBtn);
  });
}
