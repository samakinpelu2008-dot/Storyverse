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

// Admin unlock
let adminTapCount = 0;
const adminPanel = document.getElementById('admin-panel');
document.getElementById('logo').addEventListener('click', () => {
  adminTapCount++;
  if(adminTapCount>=10){
    const password = prompt('Enter Admin Password:');
    if(password==='storyverse-admin') adminPanel.classList.remove('hidden');
    else alert('Incorrect Password!');
    adminTapCount=0;
  }
});

// DOM Elements
const storiesContainer = document.getElementById('stories-container');
const searchInput = document.getElementById('searchInput');
const categoriesDiv = document.getElementById('categories');
const notificationsContainer = document.getElementById('notifications-container');
const notifDot = document.getElementById('notif-dot');

// Load categories
const categories = ['Horror','Romance','Sci-Fi','Mystery','Fantasy'];
categories.forEach(cat=>{
  const div=document.createElement('div');
  div.textContent=cat;
  div.style.background='#4b0082';
  div.style.padding='5px 10px';
  div.style.borderRadius='12px';
  categoriesDiv.appendChild(div);
});

// Fetch and render stories from Firebase
async function loadStories(){
  const snapshot = await db.collection('stories').orderBy('views','desc').get();
  storiesContainer.innerHTML='';
  snapshot.forEach(doc=>{
    const s = doc.data();
    const div=document.createElement('div');
    div.className='story-card';
    div.innerHTML=`<img src="${s.image}" alt="${s.title}"><div class="info"><h3>${s.title}</h3><p>By ${s.author}</p></div>`;
    div.addEventListener('click',()=>alert(s.content)); // Opens story content
    storiesContainer.appendChild(div);
  });
}

// Search filter
searchInput.addEventListener('input', loadStories);

// Load stories initially
loadStories();

// Notifications
async function loadNotifications(){
  const snapshot = await db.collection('notifications').where('read','==',false).get();
  notificationsContainer.innerHTML='';
  snapshot.forEach(doc=>{
    const n = doc.data();
    const div = document.createElement('div');
    div.className='notification';
    div.innerHTML=`<h4>${n.heading}</h4><p>${n.body}</p>`;
    div.addEventListener('click', async ()=>{
      alert(n.body);
      await db.collection('notifications').doc(doc.id).update({read:true});
      loadNotifications();
    });
    notificationsContainer.appendChild(div);
  });
  notifDot.classList.toggle('hidden', snapshot.empty);
}

// Mark all as read
document.getElementById('markAllReadBtn').addEventListener('click', async ()=>{
  const snapshot = await db.collection('notifications').where('read','==',false).get();
  const batch = db.batch();
  snapshot.forEach(doc=>batch.update(doc.ref,{read:true}));
  await batch.commit();
  loadNotifications();
});

// Add new story
document.getElementById('addStoryBtn').addEventListener('click', async ()=>{
  const title=document.getElementById('storyTitle').value;
  const author=document.getElementById('storyAuthor').value;
  const image=document.getElementById('storyImage').value;
  const content=document.getElementById('storyContent').value;
  const section=document.getElementById('storySection').value;
  if(!title||!author||!image||!content) return alert('Fill all fields');
  await db.collection('stories').doc(title).set({title,author,image,content,section,views:0,likes:0});
  alert('Story added!');
  loadStories();
});

// Add notification
document.getElementById('addNotifBtn').addEventListener('click', async ()=>{
  const heading=document.getElementById('notifHeading').value;
  const body=document.getElementById('notifBody').value;
  if(!heading||!body) return alert('Fill all fields');
  await db.collection('notifications').add({heading,body,read:false});
  alert('Notification added!');
  loadNotifications();
});

// Initial load
loadNotifications();
