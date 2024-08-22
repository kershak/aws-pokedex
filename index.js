// index.js
const API = "http://localhost:3000/ramens"

  fetch(API)
  .then((res) => res.json())
  .then(renderRamens)
  .catch(error => console.log(error));

function renderRamens(ramens) {
  //console.log(ramens);
  ramens.forEach(renderRamen)
}

function renderRamen(ramen) {
  const ramenMenuDiv = document.getElementById("ramen-menu");
  //console.log (ramenMenuDiv)
  const ramenImage = document.createElement('img')
  ramenImage.src = ramen.image;
  ramenMenuDiv.append(ramenImage);

  ramenImage.addEventListener("click", (event) => handleClick(ramen))
}

function renderDetails(ramen) {
  //console.log(ramen.image)
  //const ramenDetailDiv = document.getElementsByClassName('ramen-detail');
  const detailImage = document.getElementById("detail-image");
  const ramenName = document.getElementById('ramen-name');
  const restaurantName = document.getElementById('restaurant');
  const ratingDisplay = document.getElementById("rating-display");
  const commentDisplay = document.getElementById("comment-display");

  //ramenDetailDiv.src = ramen
  detailImage.src = ramen.image;
  detailImage.alt = ramen.name;
  ramenName.textConftent = ramen.name;
  restaurantName.textContent = ramen.restaurant; 
  ratingDisplay.textContent = ramen.rating;
  commentDisplay.textContent = ramen.comment;

}

document.getElementById("new-ramen").addEventListener("submit",createNewRamen);
function createNewRamen(event){
  event.preventDefault();
  //console.log(event.target.name.value)

  const newRamenObj = {
    name : event.target.name.value,
    restaurant: event.target.restaurant.value,
    image: event.target.image.value,
    rating: event.target.rating.value,
    comment: event.target["new-comment"].value,
  };
  //console.log(newRamenObj);
  

  //e.target.clear();


  fetch(API, {
    method : 'POST',
    headers : {
      'Content-Type': 'application/json'

    },
    body:JSON.stringify(newRamenObj)
  })
  .then(res => res.json())
  .then(updateRamenList);

  document.getElementById("new-ramen").reset();
}

function updateRamenList() {
  fetch(API)
    .then((res) => res.json())
    .then((updatedRamens) => {
      // Clear the existing ramen images
      const ramenMenuDiv = document.getElementById("ramen-menu");
      ramenMenuDiv.innerHTML = ''; 
      // Re-render the ramen images with the updated data
      updatedRamens.forEach(renderRamen);
    });
}
      

// Callbacks
const handleClick = (ramen) => {
  // Add code
  renderDetails(ramen);
};

const addSubmitListener = () => {
  // Add code
  const newRamenForm = document.getElementById("new-ramen");
  newRamenForm.addEventListener("submit", createNewRamen);
};

const displayRamens = () => {
  // Add code
  fetch (API)
    .then((res) => res.json())
    .then(renderRamens);
};

const main = () => {
  // Invoke displayRamens here  
  displayRamens();
  // Invoke addSubmitListener here
  addSubmitListener();
};

main()


// Export functions for testing
export {
  displayRamens,
  addSubmitListener,
  handleClick,
  main,
};