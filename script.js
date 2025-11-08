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
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h2');
    title.textContent = source.name;
    card.appendChild(title);

    const desc = document.createElement('p');
    desc.textContent = source.desc;
    card.appendChild(desc);

    // tags
    const tagContainer = document.createElement('div');
    source.tags.forEach(tag => {
      const span = document.createElement('span');
      span.className = 'tag';
      span.textContent = tag;
      tagContainer.appendChild(span);
    });
    card.appendChild(tagContainer);

    // appels à projet
    source.calls.forEach(call => {
      const callDiv = document.createElement('div');
      callDiv.className = 'call';
      callDiv.innerHTML = `
        <p><strong>${call.title}</strong></p>
        <p>📅 Date limite : ${call.deadline}</p>
        <p>${call.note}</p>
        <p><a href="${call.url}" target="_blank">Voir le projet</a></p>
      `;
      card.appendChild(callDiv);
    });

    container.appendChild(card);
  });
}

loadData();
