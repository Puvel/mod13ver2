import './styles.css';
import 'material-design-icons/iconfont/material-icons.css';
import apiService from './js/apiService';
import imageCardTemplate from './templates/imageCardTemplate.hbs';
import PNotify from 'pnotify/dist/es/PNotify.js';
import 'pnotify/dist/PNotifyBrightTheme.css';
// import * as basicLightbox from 'basiclightbox';
// import 'basiclightbox/dist/basicLightbox.min.css';
import Masonry from 'masonry-layout';
import imagesLoaded from 'imagesloaded';
import InfiniteScroll from 'infinite-scroll';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  query: document.querySelector('input[name="query"]'),
  // loadMoreBtn: document.querySelector('button[data-action="load-more"]'),
};

refs.searchForm.addEventListener('submit', handleInputForm);
// refs.loadMoreBtn.addEventListener('click', fetchImages);
// refs.gallery.addEventListener('click', showImage);

// function handleInputForm(e) {
//   e.preventDefault();
//   clearList();
//   apiService.resetPage();
//   apiService.searchQuery = refs.query.value;
//   fetchImages();
//   modul();
//   refs.loadMoreBtn.classList.add('js-btn-visibil');
// }

// function fetchImages() {
//   apiService
//     .fetchImages()
//     .then(hits => {
//       createElement(hits);
//     })
//     .then(() => scroll())
//     .catch(() => {
//       PNotify.error({
//         title: 'Oh No!',
//         text: 'Something terrible happened.',
//       });
//     });
// }

// function createElement(items) {
//   const newList = items.map(item => imageCardTemplate(item)).join('');
//   refs.gallery.insertAdjacentHTML('beforeend', newList);
// }

// function clearList() {
//   refs.gallery.innerHTML = '';
//   refs.loadMoreBtn.classList.remove('js-btn-visibil');
// }

// function scroll() {
//   window.scrollTo({
//     top: document.body.scrollHeight,
//     behavior: 'smooth',
//   });
// }

// function modul() {
//   const success = PNotify.success({
//     title: 'Desktop Success',
//     text: 'All done! Come back to my tab!',
//     modules: {
//       Buttons: {
//         closer: false,
//         sticker: false,
//       },
//       Desktop: {
//         desktop: true,
//       },
//     },
//   });
//   success.on('click', function () {
//     success.close();
//   });
// }

// function showImage(e) {
//   if (e.target.nodeName === 'IMG') {
//     const largImg = e.target.dataset.url;
//     basicLightbox
//       .create(
//         `
//     	<img width="1200" height="900" src="${largImg}">
//     `,
//       )
//       .show();
//   }
// }

const masonryInstance = new Masonry(refs.gallery, {
  columnWidth: '.photo-card',
  itemSelector: '.photo-card',
  percentPosition: true,
  transitionDuration: '0.3s',
  fitWidth: true,
  gutter: 10,
});

const infScroll = new InfiniteScroll(refs.gallery, {
  responseType: 'text',
  history: false,
  path() {
    return `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${apiService.searchQuery}&page=${this.pageIndex}&per_page=12&key=16013941-0b7abfb5c3f07bad798dbf718`;
  },
  append: '.photo-card',
  outlayer: masonryInstance,
});

function handleInputForm(e) {
  e.preventDefault();
  clearList();
  apiService.resetPage();
  apiService.searchQuery = refs.query.value;

  fetchImages();
}

infScroll.on('load', function () {
  fetchImages();
  // // parse response into JSON data
  // var data = JSON.parse( response );
  // // compile data into HTML
  // var itemsHTML = data.map( getItemHTML ).join('');
  // // convert HTML string into elements
  // proxyElem.innerHTML = itemsHTML;
  // // append item elements
  // var items = proxyElem.querySelectorAll('.photo-item');
  // imagesLoaded( items, function() {
  //   infScroll.appendItems( items );
  //   msnry.appended( items );
  // });
});

infScroll.loadNextPage();

imagesLoaded(refs.gallery).on(
  'progress',
  masonryInstance.layout.bind(masonryInstance),
);

function fetchImages() {
  apiService
    .fetchImages()
    .then(hits => {
      createElement(hits);
    })
    .catch(() => {
      PNotify.error({
        title: 'Oh No!',
        text: 'Something terrible happened.',
      });
    });
}

function createElement(items) {
  const newList = items.reduce((arr, item) => {
    const div = document.createElement('div');
    div.classList.add('photo-card');
    div.innerHTML = imageCardTemplate(item);
    arr.push(div);
    return arr;
  }, []);
  refs.gallery.append(...newList);
  masonryInstance.addItems(newList);
  imagesLoaded(refs.gallery).on(
    'progress',
    masonryInstance.layout.bind(masonryInstance),
  );
}

function clearList() {
  refs.gallery.innerHTML = '';
}

//? var msnry = new Masonry( '.grid', {
//?   itemSelector: '.photo-item',
//?   columnWidth: '.grid__col-sizer',
//?   gutter: '.grid__gutter-sizer',
//?   percentPosition: true,
//?   stagger: 30,
//?   // nicer reveal transition
//?   visibleStyle: { transform: 'translateY(0)', opacity: 1 },
//?   hiddenStyle: { transform: 'translateY(100px)', opacity: 0 },
//? });

//? //------------------//

//? // Get an API key for your demos at https://unsplash.com/developers
//? var unsplashID = '9ad80b14098bcead9c7de952435e937cc3723ae61084ba8e729adb642daf0251';

//? var infScroll = new InfiniteScroll( '.grid', {
//?   path: function() {
//?     return 'https://api.unsplash.com/photos?client_id='
//?       + unsplashID + '&page=' + this.pageIndex;
//?   },
//?   // load response as flat text
//?   responseType: 'text',
//?   outlayer: msnry,
//?   status: '.page-load-status',
//?   history: false,
//? });

//? // use element to turn HTML string into elements
//? var proxyElem = document.createElement('div');

// ?infScroll.on( 'load', function( response ) {
// ?  // parse response into JSON data
// ?  var data = JSON.parse( response );
// ?  // compile data into HTML
// ?  var itemsHTML = data.map( getItemHTML ).join('');
// ?  // convert HTML string into elements
// ?  proxyElem.innerHTML = itemsHTML;
// ?  // append item elements
// ?  var items = proxyElem.querySelectorAll('.photo-item');
// ?  imagesLoaded( items, function() {
// ?    infScroll.appendItems( items );
// ?    msnry.appended( items );
// ?  });
// ?});

// ?load initial page
// ?infScroll.loadNextPage();

//? //------------------//

//? var itemTemplateSrc = document.querySelector('#photo-item-template').innerHTML;

// ?function getItemHTML( photo ) {
// ?  return microTemplate( itemTemplateSrc, photo );
// ?}

//? // micro templating, sort-of
//? function microTemplate( src, data ) {
//?   // replace {{tags}} in source
//?   return src.replace( /\{\{([\w\-_\.]+)\}\}/gi, function( match, key ) {
//?     // walk through objects to get value
//?     var value = data;
//?     key.split('.').forEach( function( part ) {
//?       value = value[ part ];
//?     });
//?     return value;
//?   });
//? }
