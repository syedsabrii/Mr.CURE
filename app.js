const $ = (id) => document.getElementById(id);
const views = {patient:$("patientView"), asha:$("ashaView"), hospital:$("hospitalView"), detail:$("detailView")};

$("roleSelect").addEventListener("change", e => {
  Object.values(views).forEach(v => v.classList.add("hidden"));
  views[e.target.value].classList.remove("hidden");
});

$("emergencyBtn").onclick = () => $("emergencyModal").classList.remove("hidden");
$("closeModal").onclick = () => $("emergencyModal").classList.add("hidden");

$("submitEmergency").onclick = () => {
  $("emergencyModal").classList.add("hidden");
  toast("Emergency request created. Transport coordination started.");
  showDetail("emergency");
};

$("readyBtn").onclick = () => {
  $("readyMessage").classList.remove("hidden");
  $("readyBtn").textContent = "Patient Marked Incoming";
  toast("Receiving team marked ready.");
};

$("voiceBtn").onclick = () => {
  const text = "Aapke area mein baarish ke baad machar ke badne ka  risk badh sakta hai. Ghar ke aas paas jama paani hataiye aur machhar se bachav ke upay kijiye.";
  if ("speechSynthesis" in window) {
    speechSynthesis.cancel();
    speechSynthesis.speak(new SpeechSynthesisUtterance(text));
    toast("Playing demo voice alert.");
  } else toast("Voice playback is not supported by this browser.");
};

document.addEventListener("click", e => {
  const target = e.target.closest("[data-page]");
  if (!target) return;
  showDetail(target.dataset.page);
});

$("backBtn").onclick = () => {
  views.detail.classList.add("hidden");
  const role = $("roleSelect").value;
  views[role].classList.remove("hidden");
};

function showDetail(page){
  Object.values(views).forEach(v => v.classList.add("hidden"));
  views.detail.classList.remove("hidden");
  const content = $("detailContent");
  const pages = {
    emergency: `
      <div class="detail-card">
        <p class="eyebrow">EMERGENCY ACTIVE</p><h1>Ramesh Kumar</h1>
        <p>🚑 <strong>Transport coordination in progress</strong></p>
        <p>📍 Rampur Village</p><p>🏥 Destination: District Hospital</p>
        <div class="timeline">
          <div class="timeline-item"><span class="dot"></span><div><strong>Emergency request created</strong><small>Just now</small></div></div>
          <div class="timeline-item"><span class="dot"></span><div><strong>Hospital pre-arrival alert sent</strong><small>Essential information shared</small></div></div>
          <div class="timeline-item"><span class="dot pending"></span><div><strong>Patient en route</strong><small>ETA 18 minutes • Demo status</small></div></div>
        </div>
      </div>`,
    passport: `
      <div class="detail-card">
        <p class="eyebrow">CARE PASSPORT</p><h1>Ramesh Kumar <small>• 54</small></h1>
        <p class="muted">Demo record • Relevant information for care coordination</p>
        <div class="timeline">
          <div class="timeline-item"><span class="dot"></span><div><strong>Village / Health Worker</strong><small>Initial assessment recorded</small></div></div>
          <div class="timeline-item"><span class="dot"></span><div><strong>PHC Consultation</strong><small>Previous consultation • Demo data</small></div></div>
          <div class="timeline-item"><span class="dot"></span><div><strong>Emergency Referral</strong><small>District Hospital notified</small></div></div>
          <div class="timeline-item"><span class="dot pending"></span><div><strong>District Hospital</strong><small>Incoming • ETA 18 minutes</small></div></div>
          <div class="timeline-item"><span class="dot pending"></span><div><strong>Follow-up</strong><small>To be scheduled after care</small></div></div>
        </div>
      </div>`,
    referral: `
      <div class="detail-card">
        <p class="eyebrow">REFERRAL TRACKING</p><h1>PHC → District Hospital</h1>
        <p class="muted">Ramesh Kumar • Demo referral</p>
        <div class="timeline">
          <div class="timeline-item"><span class="dot"></span><div><strong>Referral created</strong><small>✓ Complete</small></div></div>
          <div class="timeline-item"><span class="dot"></span><div><strong>Hospital notified</strong><small>✓ Accepted</small></div></div>
          <div class="timeline-item"><span class="dot"></span><div><strong>Transport coordinated</strong><small>✓ In progress</small></div></div>
          <div class="timeline-item"><span class="dot pending"></span><div><strong>Consultation</strong><small>Pending arrival</small></div></div>
          <div class="timeline-item"><span class="dot pending"></span><div><strong>Follow-up</strong><small>Pending</small></div></div>
        </div>
      </div>`,
    weather: `
      <div class="detail-card">
        <p class="eyebrow">PRE-GUIDE</p><h1>🌦️ Elevated Seasonal Risk</h1>
        <p><strong>📍 Rampur Village</strong></p>
        <div class="grid two">
          <div class="card"><strong>🌧️ Rain</strong><p class="muted">Expected in the coming period</p></div>
          <div class="card"><strong>💧 Humidity</strong><p class="muted">Favourable conditions for mosquitoes</p></div>
        </div>
        <h3>Recommended actions</h3>
        <p>Remove standing water • Use mosquito protection • Watch for symptoms • Seek care when needed.</p>
        <button class="primary-btn" id="detailVoice">🔊 Play local-language voice alert</button>
        <p class="muted" style="font-size:12px;margin-top:15px">Prototype note: this screen demonstrates a risk-signal workflow, not a clinically validated outbreak prediction.</p>
      </div>`,
    next: `
      <div class="detail-card">
        <p class="eyebrow">NEXT-MOVE</p><h1>🏥 Visit PHC today</h1>
        <p>Your next recommended action based on the demo care plan.</p>
        <div class="card"><strong>Suggested window</strong><p class="muted">2 PM – 4 PM • Demo availability</p></div>
        <button class="primary-btn" style="margin-top:15px" onclick="toast('Action confirmed in prototype.')">Take Action</button>
      </div>`,
    findcare: `
      <div class="detail-card">
        <p class="eyebrow">PUBLIC CARE</p><h1>Nearby public facilities</h1>
        <div class="priority-row"><div><strong>District Hospital</strong><small>Emergency • Public facility • 24/7 shown for demo</small></div><span class="tag green-tag">0.8 km</span></div>
        <div class="priority-row"><div><strong>Primary Health Centre</strong><small>General care • Referral support</small></div><span class="tag green-tag">3.2 km</span></div>
      </div>`
  };
  content.innerHTML = pages[page] || pages.patient;
  const dv = $("detailVoice");
  if(dv) dv.onclick = () => $("voiceBtn").click();
}

function toast(message){
  const t=$("toast"); t.textContent=message; t.classList.add("show");
  setTimeout(()=>t.classList.remove("show"),2600);
}
