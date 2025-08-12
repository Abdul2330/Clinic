// XLSX File Handling
var gk_isXlsx = false;
var gk_xlsxFileLookup = {};
var gk_fileData = {};
function filledCell(cell) {
  return cell !== '' && cell != null;
}
function loadFileData(filename) {
  if (gk_isXlsx && gk_xlsxFileLookup[filename]) {
    try {
      var workbook = XLSX.read(gk_fileData[filename], { type: 'base64' });
      var firstSheetName = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[firstSheetName];
      var jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });
      var filteredData = jsonData.filter(row => row.some(filledCell));
      var headerRowIndex = filteredData.findIndex((row, index) =>
        row.filter(filledCell).length >= filteredData[index + 1]?.filter(filledCell).length
      );
      if (headerRowIndex === -1 || headerRowIndex > 25) {
        headerRowIndex = 0;
      }
      var csv = XLSX.utils.aoa_to_sheet(filteredData.slice(headerRowIndex));
      csv = XLSX.utils.sheet_to_csv(csv, { header: 1 });
      return csv;
    } catch (e) {
      console.error(e);
      return "";
    }
  }
  return gk_fileData[filename] || "";
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Mobile Menu Toggle
const menuToggle = document.getElementById('menu-toggle');
const mobileMenu = document.getElementById('mobile-menu');
menuToggle.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  menuToggle.querySelector('svg').innerHTML = mobileMenu.classList.contains('hidden') ?
    `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />` :
    `<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />`;
});

// Mock API for Doctors
const fetchDoctors = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: 'Dr. John Smith', department: 'Cardiology' },
        { name: 'Dr. Emily Brown', department: 'Neurology' },
        { name: 'Dr. Michael Lee', department: 'Orthopedics' },
        { name: 'Dr. Sarah Davis', department: 'Dental Surgery' },
      ]);
    }, 1000);
  });
};

// Doctors Carousel
const carousel = document.getElementById('doctors-carousel');
fetchDoctors().then(doctors => {
  doctors.forEach(doctor => {
    const card = document.createElement('div');
    card.className = 'min-w-[250px] bg-white p-6 rounded-lg shadow-md flex-shrink-0';
    card.innerHTML = `
      <img src="https://via.placeholder.com/200x200?text=${doctor.name}" alt="${doctor.name}" class="w-full h-40 object-cover rounded-lg mb-4">
      <h3 class="text-lg font-semibold text-blue-800">${doctor.name}</h3>
      <p class="text-gray-600">${doctor.department}</p>
    `;
    carousel.appendChild(card);
  });
  let scrollPosition = 0;
  const cardWidth = 250 + 24;
  setInterval(() => {
    scrollPosition += cardWidth;
    if (scrollPosition >= carousel.scrollWidth - carousel.clientWidth) {
      scrollPosition = 0;
    }
    carousel.scrollTo({ left: scrollPosition, behavior: 'smooth' });
  }, 3000);
});

// Appointment Form Submission
const form = document.getElementById('appointment-form');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const data = {
    name: formData.get('name'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    date: formData.get('date'),
  };
  console.log('Appointment Data:', data);
  alert('Appointment booked successfully!');
  form.reset();
});

// Testimonial Toggle
document.querySelectorAll('.toggle-testimonial').forEach(button => {
  button.addEventListener('click', () => {
    const fullText = button.parentElement.querySelector('.testimonial-full');
    fullText.classList.toggle('hidden');
    button.textContent = fullText.classList.contains('hidden') ? 'Read More' : 'Read Less';
  });
});
