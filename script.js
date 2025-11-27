// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBEOlLBZvTRxjzxBal9HstvnU2121TXzJg",
  authDomain: "storyverse-2dd65.firebaseapp.com",
  projectId: "storyverse-2dd65",
  storageBucket: "storyverse-2dd65.firebasestorage.app",
  messagingSenderId: "547979964176",
  appId: "1:547979964176:web:9faefc0d45209289ab3f95"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Story Data
let stories = [];
let episodes = [];
let notifications = [];
let adminTapCount = 0;

// Categories
const categories = ['Horror','Romance','Sci-Fi','Mystery','Fantasy'];

// DOM Elements
const storiesContainer = document.getElementById('stories-container');
const categoriesDiv = document.getElementById('categories');
const adminPanel = document.getElementById('admin-panel');
const notifDot = document.getElementById('notif-dot');
const notificationsContainer = document.getElementById('notifications-container');
const searchInput = document.getElementById('searchInput');

// Initialize categories
categories.forEach(cat=>{
  const div = document.createElement('div');
  div.textContent = cat;
  div.style.background = '#4b0082';
  div.style.padding = '5px 10px';
  div.style.borderRadius = '12px';
  categoriesDiv.appendChild(div);
});

// Logo tap for admin
document.getElementById('logo').addEventListener('click',()=>{
  adminTapCount++;
  if(adminTapCount>=10){
    const password = prompt('Enter Admin Password:');
    if(password==='storyverse-admin') adminPanel.classList.remove('hidden');
    else alert('Incorrect Password!');
    adminTapCount=0;
  }
});

// Render stories
function renderStories(){
  storiesContainer.innerHTML='';
  const search = searchInput.value.toLowerCase();
  stories.filter(s=>s.title.toLowerCase().includes(search))
    .forEach(story=>{
      const div = document.createElement('div');
      div.className='story-card';
      div.innerHTML = `<img src="${story.img}" alt="${story.title}"><div class="info"><h3>${story.title}</h3><p>By ${story.author}</p></div>`;
      storiesContainer.appendChild(div);
    });
}

// Add story
document.getElementById('addStoryBtn').addEventListener('click',()=>{
  const title=document.getElementById('storyTitle').value;
  const author=document.getElementById('storyAuthor').value;
  const img=document.getElementById('storyImage').value;
  const section=document.getElementById('storySection').value;
  if(!title||!author||!img) return alert('Fill all fields');
  stories.push({title,author,img,section,views:0,likes:0});
  renderStories();
});

// Add episode
document.getElementById('addEpisodeBtn').addEventListener('click',()=>{
  const storyId = document.getElementById('episodeStoryId').value;
  const epTitle = document.getElementById('episodeTitle').value;
  const epNumber = document.getElementById('episodeNumber').value;
  if(!storyId||!epTitle||!epNumber) return alert('Fill all fields');
  episodes.push({storyId,epTitle,epNumber});
  alert('Episode added!');
});

// Notifications
function renderNotifications(){
  notificationsContainer.innerHTML='';
  notifications.forEach(n=>{
    const div = document.createElement('div');
    div.className='notification';
    div.innerHTML=`<h4>${n.heading}</h4><p>${n.body}</p>`;
    notificationsContainer.appendChild(div);
  });
  notifDot.classList.toggle('hidden', notifications.length===0);
}

document.getElementById('addNotifBtn').addEventListener('click',()=>{
  const h = document.getElementById('notifHeading').value;
  const b = document.getElementById('notifBody').value;
  if(!h||!b) return alert('Fill all fields');
  notifications.push({heading:h,body:b});
  renderNotifications();
});

document.getElementById('markAllReadBtn').addEventListener('click',()=>{
  notifications = [];
  renderNotifications();
});

// Search filter
searchInput.addEventListener('input', renderStories);

// Initial render
renderStories();
renderNotifications();
