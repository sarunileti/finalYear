// Dropdown menu for mobile navigation
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
  navMenu.classList.toggle('nav-menu--visible');
});

// Form validation
const form = document.querySelector('.contact-form');
const nameInput = form.querySelector('#name');
const emailInput = form.querySelector('#email');
const messageInput = form.querySelector('#message');
const errorDiv = form.querySelector('.error');

form.addEventListener('submit', (event) => {
  event.preventDefault();

  if (nameInput.value === '' || emailInput.value === '' || messageInput.value === '') {
    errorDiv.textContent = 'Please fill out all fields.';
    errorDiv.style.display = 'block';
  } else {
    // Send form data to server
    errorDiv.style.display = 'none';
    alert('Thank you for your message!');
  }
});

// Handle user input
const input = document.querySelector('#search-input');
const resultsList = document.querySelector('#results-list');
const searchResults = ['Checking Account', 'Savings Account', 'Credit Card'];

input.addEventListener('input', () => {
  const searchText = input.value.toLowerCase();
  let filteredResults = searchResults.filter(result => result.toLowerCase().includes(searchText));

  resultsList.innerHTML = '';

  filteredResults.forEach(result => {
    const li = document.createElement('li');
    li.textContent = result;
    resultsList.appendChild(li);
  });
});
// VALIDATING hyperlinks

