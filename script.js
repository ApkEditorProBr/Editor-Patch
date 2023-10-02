//Limpar o conteúdo do "texarea". 
function limpar() {
  document.getElementById("editorContent").value = "";
}

//Função que é executada quando a janela é carregada
window.onload = function() {
  //Obtém o elemento de entrada de arquivo pelo seu ID
  const fileInput = document.getElementById('file-input');
  //Obtém o elemento do editor de texto pelo seu ID
  const editor = document.getElementById('editorContent');
  //Obtém o botão de salvar pelo seu ID
  const saveBtn = document.getElementById('save-btn');

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

                  //Atualiza as linhas numéricas
                  updateLineNumbers();
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
}
