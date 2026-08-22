const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxbgghF-JxXP5EuYfYGLWakZCESxhchh5Mp0_1s8xMxLLgGm4m2McAU8BRWglo3-oll/exec";

const places = [
  { id: 1, name: "WAT PHRA MAHATHAT WORAMAHAWIHAN", image: "https://cdn.phototourl.com/free/2026-08-22-69417acb-eb1e-4ea0-b453-0316d8a57aeb.png" },
  { id: 2, name: "WAT CHEDI (AI KHAI)", image: "https://cdn.phototourl.com/free/2026-08-08-00b5e41f-f683-429e-be32-a97d5d701f98.png" },
  { id: 3, name: "WAT KANG PLA, THUNG SONG", image: "https://cdn.phototourl.com/free/2026-08-08-20382626-5cfa-4806-8741-51702892a5f2.png" },
  { id: 4, name: "YONG WATERFALL", image: "https://cdn.phototourl.com/free/2026-08-22-16f95a54-9c10-4898-b189-d73a9aef497b.png" },
  { id: 5, name: "KHANOM-SICHON COASTLINE", image: "https://cdn.phototourl.com/free/2026-08-08-6882b009-f5e6-44f3-8304-283ef15051c0.png" },
  { id: 6, name: "KIRIWONG VILLAGE", image: "https://cdn.phototourl.com/free/2026-08-22-2a7810c5-63c8-4c0e-8c75-f515cad5b81b.png" },
  { id: 7, name: "NANG TALUNG SUCHART HOUSE", image: "https://cdn.phototourl.com/free/2026-08-08-ade8e345-014e-44cd-81a3-b486b43c1418.jpg" },
  { id: 8, name: "NAKHON SI THAMMARAT CITY SHRINE", image: "https://cdn.phototourl.com/free/2026-08-22-5cf719cc-a8fa-4f54-811f-72abf8e90776.png" },
  { id: 9, name: "PHRA ISUAN & PHRA NARAI SHRINES", image: "https://cdn.phototourl.com/free/2026-08-08-7451ec9b-a060-4e93-917e-faf9498bbea8.png" },
  { id: 10, name: "WALAILAK UNIVERSITY", image: "https://cdn.phototourl.com/free/2026-08-22-8a1eaa32-63c3-49a3-acc6-6b2698b2fe26.png" },
  { id: 11, name: "THE ROYAL RESIDENCE & PAK PHANANG", image: "https://cdn.phototourl.com/free/2026-08-08-2b471a7d-9f9f-4106-ad1a-f38042167cab.png" },
  { id: 12, name: "NAKHON SI THAMMARAT HANDICRAFT CENTRE", image: "https://cdn.phototourl.com/free/2026-08-08-6c94574b-9c9c-4ada-a4b8-550eea37da15.png" }
];

const questionPool = [
  { q: "When is the best time to visit?", a: "The best time to visit is during the cool and dry season from November to February." },
  { q: "What is the historical and cultural significance?", a: "It carries a deep cultural heritage and plays a significant role in local history." },
  { q: "How can I get there using local transportation?", a: "You can easily reach it by taking a local songthaew, a taxi, or renting a scooter." },
  { q: "Are there any recommended local foods nearby?", a: "Yes, there are many authentic southern local restaurants and street food stalls nearby." },
  { q: "What should I wear or prepare before coming?", a: "It is recommended to dress politely, wear comfortable shoes, and bring sunscreen or a hat." },
  { q: "Is there any entrance fee required?", a: "General admission is typically free, but some specialized zones may have minor fees." },
  { q: "What are the regular opening hours?", a: "It is generally open daily from morning around 8:30 AM to late afternoon." },
  { q: "Can you share a fascinating local legend about this place?", a: "Local folklore tells of ancient blessings and historical events tied closely to this site." },
  { q: "Are there good souvenir shops around?", a: "Yes, you can find unique regional handicrafts and local products nearby." },
  { q: "Is this attraction family-friendly?", a: "Yes, it is entirely suitable for visitors of all ages, including children and seniors." }
];

const placeChat = {};
places.forEach(p => {
  let sampleQuestions = [];
  for (let i = 1; i <= 60; i++) {
    let template = questionPool[(i - 1) % questionPool.length];
    sampleQuestions.push({
      id: i,
      q: `${template.q}`,
      a: `${template.a} Specifically for ${p.name}, it offers an unforgettable experience.`,
      isClicked: false
    });
  }
  placeChat[p.id] = {
    intro: `Welcome! Let's talk about ${p.name}. What would you like to know?`,
    questions: sampleQuestions
  };
});

let currentRole = null;
let currentAttractionPage = 0;
let selectedPlace = null;
let countdownTimer = null;

document.addEventListener("DOMContentLoaded", () => {
  checkLogin();
  renderAttractions();
  initSurveyValidation(); 
});

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
  });
  const target = document.getElementById(pageId);
  if (target) {
    target.classList.add("active");
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleAccount() {
  updateAccount();
  const panel = document.getElementById("accountPanel");
  if (panel) {
    panel.classList.toggle("hidden");
  }
}

function chooseRole(role) {
  currentRole = role;
  localStorage.setItem("pop_role", role);
  if (role === "tourist") {
    showPage("page2Tourist");
  } else {
    showPage("page2Guide");
  }
  loadSavedProfileData(role);
}

function previewProfile(input, type) {
  const file = input.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    const imgId = type === "tourist" ? "touristProfileImage" : "guideProfileImage";
    const img = document.getElementById(imgId);
    const placeholder = document.getElementById(imgId.replace("Image", "Placeholder"));

    if (img) {
      img.src = e.target.result;
      img.style.display = "block";
    }
    if (placeholder) {
      placeholder.style.display = "none";
    }

    localStorage.setItem(`pop_profile_image_${type}`, e.target.result);
  };
  reader.readAsDataURL(file);
}

function backToRoleSelection() { showPage("page1"); }
function editTouristForm() { showPage("page2Tourist"); }
function editGuideForm() { showPage("page2Guide"); }

function completeRegistration(role) {
  let profile = { role: role };
  if (role === "tourist") {
    profile.prefix = document.getElementById("touristPrefix")?.value || "";
    profile.fullName = document.getElementById("touristName")?.value || "";
    profile.age = document.getElementById("touristAge")?.value || "";
    profile.purpose = document.getElementById("touristPurpose")?.value || "";
    profile.arrival = document.getElementById("touristArrival")?.value || "";
    profile.departure = document.getElementById("touristDeparture")?.value || "";
    profile.profileImage = localStorage.getItem("pop_profile_image_tourist") || "";

    if (!profile.fullName || !profile.age) {
      alert("Please fill in your name and age.");
      return;
    }
  } else {
    profile.prefix = document.getElementById("guidePrefix")?.value || "";
    profile.fullName = document.getElementById("guideName")?.value || "";
    profile.age = document.getElementById("guideAge")?.value || "";
    profile.organization = document.getElementById("guideOrganization")?.value || "";
    profile.purpose = document.getElementById("guidePurpose")?.value || "";
    profile.profileImage = localStorage.getItem("pop_profile_image_guide") || "";

    if (!profile.fullName || !profile.age) {
      alert("Please fill in your name and age.");
      return;
    }
  }

  localStorage.setItem("pop_profile", JSON.stringify(profile));
  
  // ส่งข้อมูลการลงทะเบียนไป Google Sheets
  fetch(APP_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ type: "registration", ...profile })
  }).catch(err => console.error("Sheet error:", err));

  updateAccount();
  showToast("Saved successfully!");
  
  // เปลี่ยนไปหน้า Here2Go สำหรับทั้งฝั่ง Tourist และ Tour Guide
  showPage("pageHere2Go");
}

// ฟังก์ชันกดจากหน้า Here2Go ไปหน้าเลือกสถานที่ (Attractions)
function goToAttractionsFromHere2Go() {
  showPage("page3");
  renderAttractions();
}

function loadSavedProfileData(role) {
  const saved = localStorage.getItem("pop_profile");
  if (!saved) return;
  try {
    const profile = JSON.parse(saved);
    if (profile.role !== role) return;

    if (role === "tourist") {
      if (document.getElementById("touristPrefix")) document.getElementById("touristPrefix").value = profile.prefix || "";
      if (document.getElementById("touristName")) document.getElementById("touristName").value = profile.fullName || "";
      if (document.getElementById("touristAge")) document.getElementById("touristAge").value = profile.age || "";
      if (document.getElementById("touristPurpose")) document.getElementById("touristPurpose").value = profile.purpose || "";
      if (document.getElementById("touristArrival")) document.getElementById("touristArrival").value = profile.arrival || "";
      if (document.getElementById("touristDeparture")) document.getElementById("touristDeparture").value = profile.departure || "";
    } else {
      if (document.getElementById("guidePrefix")) document.getElementById("guidePrefix").value = profile.prefix || "";
      if (document.getElementById("guideName")) document.getElementById("guideName").value = profile.fullName || "";
      if (document.getElementById("guideAge")) document.getElementById("guideAge").value = profile.age || "";
      if (document.getElementById("guideOrganization")) document.getElementById("guideOrganization").value = profile.organization || "";
      if (document.getElementById("guidePurpose")) document.getElementById("guidePurpose").value = profile.purpose || "";
    }

    const imgKey = `pop_profile_image_${role}`;
    const imgData = localStorage.getItem(imgKey);
    if (imgData) {
      const img = document.getElementById(role === "tourist" ? "touristProfileImage" : "guideProfileImage");
      const placeholder = document.getElementById(role === "tourist" ? "touristProfilePlaceholder" : "guideProfilePlaceholder");
      if (img && placeholder) {
        img.src = imgData;
        img.style.display = "block";
        placeholder.style.display = "none";
      }
    }
  } catch (e) {
    console.error(e);
  }
}

function renderAttractions() {
  const grid = document.getElementById("attractionGrid");
  if (!grid) return;
  grid.innerHTML = "";

  const start = currentAttractionPage * 3;
  const end = Math.min(start + 3, places.length);

  for (let i = start; i < end; i++) {
    const place = places[i];
    const item = document.createElement("div");
    item.className = "attraction-item";
    if (selectedPlace && selectedPlace.id === place.id) {
      item.classList.add("selected");
    }

    item.innerHTML = `
      <div class="attraction-image">
        <img src="${place.image}" alt="${place.name}" loading="lazy">
      </div>
      <div class="selected-label">✓ Selected</div>
      <div class="attraction-name">${place.name}</div>
    `;

    item.onclick = () => {
      selectedPlace = place;
      renderAttractions();
      const confirmBtn = document.getElementById("confirmAttractionButton");
      if (confirmBtn) confirmBtn.disabled = false;
    };

    grid.appendChild(item);
  }

  const indicator = document.getElementById("attractionPageIndicator");
  if (indicator) {
    indicator.textContent = `Page ${currentAttractionPage + 1} of 4`;
  }

  const backBtn = document.getElementById("attractionBackButton");
  const nextBtn = document.getElementById("attractionNextButton");

  if (backBtn && backBtn.parentElement) {
    backBtn.parentElement.style.display = "flex";
    backBtn.parentElement.style.justifyContent = "space-between";
    backBtn.parentElement.style.alignItems = "center";
  }

  if (backBtn) {
    if (currentAttractionPage === 0) {
      backBtn.style.display = "none";
    } else {
      backBtn.style.display = "inline-block";
    }
  }

  if (nextBtn) {
    nextBtn.style.marginLeft = "auto";
    if (currentAttractionPage >= 3) {
      nextBtn.style.display = "none";
    } else {
      nextBtn.style.display = "inline-block";
    }
  }
}

function nextAttractionPage() {
  if (currentAttractionPage < 3) {
    currentAttractionPage++;
    renderAttractions();
  }
}

function previousAttractionPage() {
  if (currentAttractionPage > 0) {
    currentAttractionPage--;
    renderAttractions();
  }
}

function confirmAttraction() {
  if (!selectedPlace) {
    alert("Please select a destination first.");
    return;
  }
  localStorage.setItem("pop_selected_place", JSON.stringify(selectedPlace));
  startMatching();
}

function startMatching() {
  showPage("page4");
  const countdownEl = document.getElementById("countdown");
  const progressBar = document.getElementById("progressBar");
  const waitingText = document.getElementById("waitingText");
  const waitingResult = document.getElementById("waitingResult");

  if (waitingResult) waitingResult.classList.add("hidden");
  if (waitingText) waitingText.textContent = "Please wait while we find someone for you...";
  if (progressBar) progressBar.style.width = "0%";

  let seconds = 5;
  if (countdownEl) countdownEl.textContent = `${seconds}s`;

  clearInterval(countdownTimer);
  let elapsed = 0;

  countdownTimer = setInterval(() => {
    elapsed++;
    seconds--;
    if (countdownEl) countdownEl.textContent = `${seconds}s`;
    if (progressBar) progressBar.style.width = `${(elapsed / 5) * 100}%`;

    if (seconds <= 0) {
      clearInterval(countdownTimer);
      if (waitingResult) waitingResult.classList.remove("hidden");
      if (waitingText) waitingText.textContent = "Match found successfully!";
    }
  }, 1000);
}

function continueAfterMatch() { openChat(); }
function cancelMatch() { clearInterval(countdownTimer); showPage("page7"); }

function openChat() {
  showPage("page5");
  const partnerName = document.getElementById("chatPartnerName");
  if (partnerName) {
    partnerName.textContent = currentRole === "tourist" ? "Local Guide" : "Tourist";
  }

  const chatMessages = document.getElementById("chatMessages");
  if (chatMessages) {
    chatMessages.innerHTML = "";
    addBotMessage(`Welcome to ${selectedPlace ? selectedPlace.name : "Nakhon Si Thammarat"}!`);
    
    setTimeout(() => {
      addBotMessage(selectedPlace && placeChat[selectedPlace.id] ? placeChat[selectedPlace.id].intro : "How can I help you today?");
      renderQuestionOptions();
    }, 600);
  }
}

function addBotMessage(text) {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;
  const div = document.createElement("div");
  div.className = "message received";
  div.innerHTML = `<span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function addUserMessage(text) {
  const chatMessages = document.getElementById("chatMessages");
  if (!chatMessages) return;
  const div = document.createElement("div");
  div.className = "message sent";
  div.innerHTML = `<span>${text}</span>`;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function renderQuestionOptions() {
  const container = document.getElementById("questionOptions");
  if (!container || !selectedPlace) return;
  container.innerHTML = "";

  const data = placeChat[selectedPlace.id];
  if (!data || !data.questions) return;

  let remainingQuestions = data.questions.filter(item => !item.isClicked);

  if (remainingQuestions.length === 0) {
    data.questions.forEach(item => item.isClicked = false);
    remainingQuestions = [...data.questions];
  }

  const shuffled = [...remainingQuestions].sort(() => 0.5 - Math.random());
  const currentOptions = shuffled.slice(0, 3);

  currentOptions.forEach(item => {
    const btn = document.createElement("button");
    btn.className = "secondary-button full-button";
    btn.style.marginBottom = "8px";
    btn.textContent = item.q;
    
    btn.onclick = () => {
      item.isClicked = true;
      addUserMessage(item.q);
      container.innerHTML = "";

      setTimeout(() => {
        addBotMessage(item.a);
        setTimeout(() => {
          renderQuestionOptions();
        }, 600);
      }, 500);
    };
    
    container.appendChild(btn);
  });
}

function finishChat() {
  const profile = getProfile();
  if (profile && profile.role === "tourist") {
    showPage("page6Tourist");
  } else {
    showPage("page6Guide");
  }
}

function initSurveyValidation() {
  const surveyContainer = document.getElementById("touristSurvey");
  if (!surveyContainer) return;

  const totalQuestions = 7;
  surveyContainer.addEventListener("change", () => {
    let answeredCount = 0;
    for (let i = 1; i <= totalQuestions; i++) {
      const radios = document.querySelectorAll(`input[name="touristQ${i}"]`);
      let answered = Array.from(radios).some(r => r.checked);
      if (answered) answeredCount++;
    }

    const finishBtn = document.getElementById("surveyFinishBtn");
    if (finishBtn) {
      if (answeredCount === totalQuestions) {
        finishBtn.classList.add("enabled-green");
        finishBtn.disabled = false;
      } else {
        finishBtn.classList.remove("enabled-green");
        finishBtn.disabled = true;
      }
    }
  });
}

function submitTouristSurvey() {
  let surveyData = { type: "survey" };
  for (let i = 1; i <= 7; i++) {
    const selectedRadio = document.querySelector(`input[name="touristQ${i}"]:checked`);
    surveyData[`q${i}`] = selectedRadio ? selectedRadio.value : "";
  }

  fetch(APP_SCRIPT_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(surveyData)
  }).catch(err => console.error("Survey Sheet error:", err));

  showToast("Survey submitted successfully!");
  showPage("page7");
}

function startNewConversation() { showPage("page3"); }
function finishGuideSession() { showPage("page7"); }

function clearAllSelections() {
  selectedPlace = null;
  localStorage.removeItem("pop_selected_place");
  currentAttractionPage = 0;
  renderAttractions();
  const confirmBtn = document.getElementById("confirmAttractionButton");
  if (confirmBtn) confirmBtn.disabled = true;

  const surveyContainer = document.getElementById("touristSurvey");
  if (surveyContainer) {
    const radioInputs = surveyContainer.querySelectorAll('input[type="radio"]');
    radioInputs.forEach(input => { input.checked = false; });
    const finishBtn = document.getElementById("surveyFinishBtn");
    if (finishBtn) {
      finishBtn.classList.remove("enabled-green");
      finishBtn.disabled = true;
    }
  }

  const chatMessages = document.getElementById("chatMessages");
  if (chatMessages) chatMessages.innerHTML = "";
  const questionOptions = document.getElementById("questionOptions");
  if (questionOptions) questionOptions.innerHTML = "";
}

function goHome() {
  clearAllSelections();
  showPage("page1");
}

function thankYouGoToRoleSelection() {
  clearAllSelections();
  showPage("page1");
}

function resetSurveyAndGoHome() {
  clearAllSelections();
  showPage("page1");
}

function logoutUser() {
  if (confirm("Are you sure you want to log out?")) {
    localStorage.clear();
    currentRole = null;
    currentAttractionPage = 0;
    selectedPlace = null;
    if (countdownTimer) clearInterval(countdownTimer);

    const inputs = document.querySelectorAll("input, select, textarea");
    inputs.forEach(input => {
      if (input.type === "checkbox" || input.type === "radio") {
        input.checked = false;
      } else {
        input.value = "";
      }
    });

    ["touristProfileImage", "guideProfileImage", "accountAvatar"].forEach(id => {
      const img = document.getElementById(id);
      if (img) {
        img.src = "";
        img.style.display = "none";
      }
    });
    ["touristProfilePlaceholder", "guideProfilePlaceholder", "accountAvatarPlaceholder"].forEach(id => {
      const ph = document.getElementById(id);
      if (ph) ph.style.display = "block";
    });

    clearAllSelections();
    
    const panel = document.getElementById("accountPanel");
    if (panel) {
      panel.classList.add("hidden");
    }

    showPage("page1");
    showToast("Logged out successfully");
  }
}

function editAccount() {
  const profile = getProfile();
  toggleAccount();
  if (profile) chooseRole(profile.role);
  else showPage("page1");
}

function getProfile() {
  const saved = localStorage.getItem("pop_profile");
  if (!saved) return null;
  try { return JSON.parse(saved); } catch { return null; }
}

function updateAccount() {
  const profile = getProfile();
  const nameEl = document.getElementById("accountName");
  const roleEl = document.getElementById("accountRole");
  const avatarImg = document.getElementById("accountAvatar");
  const placeholder = document.getElementById("accountAvatarPlaceholder");

  if (!nameEl) return;

  if (!profile) {
    nameEl.textContent = "Guest";
    roleEl.textContent = "Not registered";
    return;
  }

  nameEl.textContent = profile.fullName || "User";
  roleEl.textContent = profile.role === "tourist" ? "Tourist" : "Tour Guide";

  const imgData = localStorage.getItem(`pop_profile_image_${profile.role}`);
  if (imgData && avatarImg) {
    avatarImg.src = imgData;
    avatarImg.classList.remove("hidden");
    if (placeholder) placeholder.style.display = "none";
  }
}

function checkLogin() {
  const profile = getProfile();
  if (profile) updateAccount();
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 3000);
}
