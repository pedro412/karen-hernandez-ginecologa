const form = () => {
  fetch('https://us-central1-vimind-3526e.cloudfunctions.net/app')
    .then((resp) => resp.json())
    .then((resp) => {
      console.log(resp);
    });
};

form();
