async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    displayCards(data.sources);
  } catch (error) {
    console.error("Erreur de chargement du JSON :", error);
  }
}

function displayCards(sources) {
  const container = document.getElementById('cards');
  container.innerHTML = '';

  sources.forEach(source => {
    source.calls.forEach(call => {
      const card = document.createElement('div');
      card.className = 'card';

      const title = document.createElement('h2');
      title.textContent = call.title;
      card.appendChild(title);

      const structure = document.createElement('p');
      structure.innerHTML = `<strong>Structure :</strong> ${source.name}`;
      card.appendChild(structure);

      const desc = document.createElement('p');
      desc.textContent = call.note;
      card.appendChild(desc);

      const deadline = document.createElement('p');
      deadline.textContent = `📅 Date limite : ${call.deadline}`;
      card.appendChild(deadline);

      const link = document.createElement('a');
      link.href = call.url;
      link.target = '_blank';
      link.textContent = 'Voir le projet';
      card.appendChild(link);

      // tags
      const tagContainer = document.createElement('div');
      source.tags.concat(call.tags || []).forEach(tag => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tag;
        tagContainer.appendChild(span);
      });
      card.appendChild(tagContainer);

      container.appendChild(card);
    });
  });
}

loadData();
