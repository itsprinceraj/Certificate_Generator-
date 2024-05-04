//-----------------------password-eye--------------------------------------
const passwordInput = document.querySelector('.password-container input');
const passwordEyeBtn = document.querySelector('.password-container i');
passwordEyeBtn.addEventListener('click',()=>{
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  if(type === 'text'){
    passwordEyeBtn.classList.remove('fa-eye-slash');
    passwordEyeBtn.classList.add('fa-eye');
  } else{
    passwordEyeBtn.classList.remove('fa-eye');
    passwordEyeBtn.classList.add('fa-eye-slash');
  }
});


//-----------------------code to generate pdf -----------------------------

const pdfDownloadBtn = document.querySelector('.download-button button a');
pdfDownloadBtn.addEventListener('click',()=>{
  document.querySelector('.confirmDownload .success-container').style.display = 'flex';
  setTimeout(()=>{
    document.querySelector('.confirmDownload').style.display = 'none';
    document.querySelector('.confirmDownload .success-container').style.display = 'none';
  },8000);
});

const pdfDownloadContainerCross = document.querySelector('.download-container i');
pdfDownloadContainerCross.addEventListener('click',()=>{
  document.querySelector('.confirmDownload').style.display = 'none';
  document.querySelector('.confirmDownload .success-container').style.display = 'none';
})


const modifyPdf = async (name, course, branch) => {
  const { degrees, PDFDocument, rgb, StandardFonts } = PDFLib;
  const url = "./dummy.pdf";
  const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  firstPage.drawText(name, {
    x: 320,
    y: 320,
    size: 60,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.9),
  });

  firstPage.drawText(course, {
    x: 320,
    y: 206,
    size: 25,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.9),
  });

  firstPage.drawText(branch, {
    x: 400,
    y: 206,
    size: 25,
    font: helveticaFont,
    color: rgb(0.1, 0.1, 0.9),
  });
  const pdfBytes = await pdfDoc.save(); // Get PDF bytes
  
  // Create Blob object from PDF bytes
  const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

  // Create URL for Blob
  const pdfUrl = URL.createObjectURL(pdfBlob);

  // Open PDF URL in a new tab
  const newWindow = window.open(pdfUrl, '_blank');
  if (!newWindow) {
    alert('Please allow pop-ups for this website to view the PDF.');
  }

  const downloadLink = document.querySelector('.download-button button a');
  downloadLink.href = pdfUrl;
  downloadLink.download = 'certificate.pdf'; 
  document.querySelector('.confirmDownload').style.display = 'flex';

};

//  Login page

const loginWrapper = document.querySelector("#login-Wrapper");

const loginBtn = document.querySelector("#login-btn");

const addStudentTab = document.querySelector(".details-container");

const generateCertificateTab = document.querySelector(".wrapper1");

const searchStudentTab = document.querySelector(".student-addData-container");

const searchStudentBtn = document.querySelector(".search-Student");

const studenDetail = document.querySelector(".student-info");

const registrationField = document.querySelector("#registration-input");

const generateBtn = document.querySelector(".generate-btn");

const genCertNav = document.querySelector(".generate-certificate");

const addStudentNav = document.querySelector(".add-student");

const studentInfoContainer = document.querySelector(".student-info");

const navBar = document.querySelector(".nav");

const loader = document.querySelector("#loader");

// const body = document.getElementsByTagName("body")

// console.log(registrationField.value)

// ----------------------Applying Event Listeners----------------------

//1).--------------code to handle from going to login page to generate certificate tab--------------------
function displayGenCertificateTab() {
  //refresh code
  sessionStorage.setItem('isLoggedIn', 'true');
  sessionStorage.setItem('lastDisplayedContainer', 'wrapper1');
  //refresh code finish
  loginWrapper.style.display = "none";
  navBar.style.display = "flex";
  generateCertificateTab.style.display = "flex";
}

document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const usernameError = document.getElementById('usernameError');
  const passwordError = document.getElementById('passwordError');
  const serverError = document.getElementById('serverError');
  const formData = new FormData(this);

  try {
      const response = await fetch('/', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData))
      });

      if (response.ok) {
          const data = await response.json();
          if (data.success == true) {
              displayGenCertificateTab();
          } else {
            if (data.error == 'incorrect_username') {
              usernameInput.style.borderColor = 'red';
              usernameError.style.display = 'block';
            } else if (data.error == 'incorrect_password') {
              passwordInput.style.borderColor = 'red';
              passwordError.style.display = 'block';
            } else {
              serverError.style.display = 'block';
            } 
          }
      } else {
          throw new Error('Network response was not ok.');
      }
  } 
  catch (error) {
    console.error('Error:', error);
    serverError.style.display = 'block';
  }
});

// Reset styles and hide error messages when user interacts with fields

function setBackAllInputFields(){
  document.getElementById('username').style.borderColor = '#ccc';
  document.getElementById('password').style.borderColor = '#ccc';
  document.getElementById('usernameError').style.display = 'none';
  document.getElementById('passwordError').style.display = 'none';
  document.getElementById('serverError').style.display = 'none';
}

document.getElementById('username').addEventListener('input', setBackAllInputFields);

document.getElementById('password').addEventListener('input', setBackAllInputFields);



//2).-------------------code to show student details container when student found only then--------------------
function displayStudentDetails() {
  if (registrationField.value !== "") {
    studenDetail.style.display = "flex";
    studenDetail.style.transition = "all 5s";
    registrationField.value = "";
  } else {
  }
}

let studentFoundData;   // To access the student found details outside the event listener scope declaring a variable outside it.
document.getElementById('searchStudentForm').addEventListener('submit',async function(event){
  event.preventDefault();
  const registrationInput = document.getElementById('registration-input');
  const registrationError = document.getElementById('registrationError');
  const serverError = document.getElementById('serverError');
  const formData = new FormData(this);

  try{
    const response = await fetch('/searchStudent', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(Object.fromEntries(formData))
    });

    if (response.ok) {
        const data = await response.json();
        if (data.success === true) {
          studentFoundData = data.StudentFound;
          document.getElementById('studentName').innerText = data.StudentFound.Name;
          document.getElementById('studentRollNo').innerText = data.StudentFound.rollNo;
          document.getElementById('studentRegistrationNo').innerText = data.StudentFound.registrationNo;
          document.getElementById('studentCourse').innerText = data.StudentFound.course;
          document.getElementById('studentBranch').innerText = data.StudentFound.branch;
          document.getElementById('studentYearOfAdmission').innerText = data.StudentFound.YearOfAdmission;
          document.getElementById('studentYearOfGraduation').innerText = data.StudentFound.YearOfGraduation;
          displayStudentDetails();
        } else {
          if(data.error == 'incorrect_registration_no'){
            registrationInput.style.borderColor = 'red';
            registrationError.style.display = 'block';
          } else{
            serverError.style.display = 'block';
          }
        }
    } else {
        throw new Error('Network response was not ok.');
    }
  }
  catch(error){
    serverError.style.display = 'block';
  }
});

// Reset styles and hide error messages when user interacts with fields
document.getElementById('registration-input').addEventListener('input', function() {
  this.style.borderColor = '#ccc'; // Set border color to #ccc
  document.getElementById('registrationError').style.display = 'none';
  document.getElementById('serverError').style.display = 'none';
  studenDetail.style.display = 'none';
  document.querySelector('.confirmDownload').style.display = 'none';
});


//----------------Handling generate certificate button and calling pdf function to generate pdf---------------------
function generateCertificate() {
  studenDetail.style.display = "none";
  modifyPdf(studentFoundData.Name , studentFoundData.course , studentFoundData.branch);
}

generateBtn.addEventListener("click", generateCertificate);



//--------------------------------Handling add student form--------------------------------------------------------
document.getElementById('addStudentForm').addEventListener('submit', async function(event) {
  event.preventDefault();
  const rollNoInput = document.getElementById('rollNo');
  const registrationNoInput = document.getElementById('registrationNo');
  const rollNoError = document.getElementById('rollNoError');
  const registrationNoError = document.getElementById('registrationNoError');
  const successMessage = document.getElementById('successMessage');
  const serverError = document.getElementById('serverError');
  const formData = new FormData(this);

  try{
    const response = await fetch('/addStudent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(Object.fromEntries(formData))
    });
    if(response.ok){
      const data = await response.json();
      if (data.success == true){
        successMessage.style.display = 'block';
        this.reset();
      } 
      else{
        if (data.error == 'rollNo_exists'){
          rollNoInput.style.borderColor = 'red';
          rollNoError.style.display = 'block';
        }
        else if (data.error == 'registrationNo_exists'){
          registrationNoInput.style.borderColor = 'red';
          registrationNoError.style.display = 'block';
        }
        else{
          serverError.style.display = 'block';
        }
      }
    } 
    else{
      throw new Error('Network response was not ok.');
    }
  }
  catch(error){
    serverError.style.display = 'block';
  }
});

function setBackRollRegistrationField(){
  document.getElementById('rollNo').style.borderColor = '';
  document.getElementById('registrationNo').style.borderColor = '';
  document.getElementById('rollNoError').style.display = 'none';
  document.getElementById('registrationNoError').style.display = 'none';
  document.getElementById('serverError').style.display = 'none';
  document.getElementById('successMessage').style.display = 'none';
}

document.getElementById('rollNo').addEventListener('input', setBackRollRegistrationField);
document.getElementById('registrationNo').addEventListener('input' , setBackRollRegistrationField);

const inputFields = document.querySelectorAll('.details-container .input-field');
inputFields.forEach(inputField => {
    inputField.addEventListener('input', function() {
      document.getElementById('serverError').style.display = 'none';
      document.getElementById('successMessage').style.display = 'none';
    });
});



//-------------------------------- handling active inactive class-----------------------------------------
genCertNav.addEventListener("click", function (event) {
  addStudentNav.classList.remove("setActive");
  genCertNav.classList.add("setActive");
  generateCertificateTab.style.display = "flex";
  searchStudentTab.style.display = "flex";
  studentInfoContainer.style.display = "none";
  //refresh code
  sessionStorage.setItem('lastDisplayedContainer','wrapper1');
  //refresh code finish
});

addStudentNav.addEventListener("click", function (event) {
  // console.log("removing set active class");
  genCertNav.classList.remove("setActive");
  // console.log("adding class");
  addStudentNav.classList.add("setActive");
  generateCertificateTab.style.display = "none";
  addStudentTab.style.display = "flex";
  //refresh code
  sessionStorage.setItem('lastDisplayedContainer','addStudentForm');
  //refresh code finish
});



//---------------------------- Show Loading Screen untill page is not completely loaded----------------------

function hideloader(){
  console.log("Hiding loader");
  loader.style.display = 'none';  
}
document.addEventListener("DOMContentLoaded", hideloader);

//---------------------------Handling which container to show when refresh browser-----------------------------
document.addEventListener('DOMContentLoaded', function(){
  const isLoggedIn = sessionStorage.getItem('isLoggedIn');
  const lastDisplayedContainer = sessionStorage.getItem('lastDisplayedContainer');
  if (isLoggedIn === 'true'){
    const containers = document.querySelectorAll('.tab');
    containers.forEach(container => {
      container.style.display = 'none';
    });

    document.getElementById(lastDisplayedContainer).style.display = 'flex';
    navBar.style.display = "flex";

    if(lastDisplayedContainer == 'wrapper1'){
      addStudentNav.classList.remove("setActive");
      genCertNav.classList.add("setActive");
    } else if(lastDisplayedContainer == 'addStudentForm'){
      genCertNav.classList.remove("setActive");
      addStudentNav.classList.add("setActive");
    }
  }
  else{
    loginWrapper.style.display = 'flex';
    //loader.style.display = 'none';
  }

});
