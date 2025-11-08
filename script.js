let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Charger les données JSON
async function loadData() {
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    displayCards(data.sources);
  } catch (error) {
    console.error("Erreur de chargement du JSON :", error);
  }
}

// Affiche toutes les cartes
function displayCards(sources) {
  const container = document.getElementById('cards');
  container.innerHTML = '';

  sources.forEach(source => {
    source.calls.forEach(call => {
      const card = createCard(call, source);
      container.appendChild(card);
    });
  });

  renderWishlistButtonStates();
}

// Crée une carte pour un appel
function createCard(call, source) {
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

  // bouton wishlist
  const wishlistBtn = document.createElement('button');
  wishlistBtn.className = 'wishlist-btn';
  wishlistBtn.dataset.id = source.name + "::" + call.title;
  wishlistBtn.addEventListener('click', () => toggleWishlist(call, source.name));
  card.appendChild(wishlistBtn);

  return card;
}

// Ajouter / retirer de la wishlist
function toggleWishlist(call, sourceName) {
  const id = sourceName + "::" + call.title;
  const index = wishlist.findIndex(item => item.id === id);

  if (index === -1) {
    wishlist.push({...call, source: sourceName, id});
  } else {
    wishlist.splice(index, 1);
  }

  localStorage.setItem('wishlist', JSON.stringify(wishlist));
  renderWishlistButtonStates();
}

// Met à jour les boutons “Ajouter / Retirer”
function renderWishlistButtonStates() {
  document.querySelectorAll('.wishlist-btn').forEach(btn => {
    const id = btn.dataset.id;
    btn.textContent = wishlist.some(item => item.id === id) ? '⭐ Retirer' : '⭐ Ajouter';
  });
}

// Génère le PDF de la wishlist
function downloadWishlistPDF() {
  if (wishlist.length === 0) return alert("Ta sélection est vide !");
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  let y = 10;

  wishlist.forEach((item, idx) => {
    doc.setFontSize(12);
    doc.text(`${idx+1}. ${item.title}`, 10, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Structure : ${item.source}`, 10, y);
    y += 5;
    doc.text(`Date limite : ${item.deadline}`, 10, y);
    y += 5;
    doc.text(`Tags : ${(item.tags || []).join(', ')}`, 10, y);
    y += 5;
    doc.text(`Note : ${item.note}`, 10, y);
    y += 10;
    
    if (y > 270) { doc.addPage(); y = 10; }
  });

  doc.save('wishlist.pdf');
}

// Bouton PDF global (à ajouter dans index.html)
const pdfBtn = document.createElement('button');
pdfBtn.textContent = '📄 Télécharger ma sélection';
pdfBtn.style.position = 'fixed';
pdfBtn.style.top = '1rem';
pdfBtn.style.right = '1rem';
pdfBtn.style.background = '#2563eb';
pdfBtn.style.color = 'white';
pdfBtn.style.padding = '0.5rem 1rem';
pdfBtn.style.borderRadius = '6px';
pdfBtn.style.zIndex = '1000';
pdfBtn.onclick = downloadWishlistPDF;
document.body.appendChild(pdfBtn);

loadData();
