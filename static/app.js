"use strict";

const HOSTNAME = "http://localhost:5001/api"; // URL! or "API BASE URL" or something more descriptive
const $cupcakesList = $("#cupcakes-list");
const mytoken = "{{ csrf_token() }}"

/**
 * Sends GET request to /cupcakes end point, and populates DOM element
 * with list of returned cupcakes.
 */
// make into two functions
async function populateCupcakeList() {
  const response = await axios({
    url: `${HOSTNAME}/cupcakes`,
    method: "GET", // default is "GET", no need for it; could use axios.get instead
  });
  const cupcakes = response.data.cupcakes; // array of cupcakes

  for (let cupcake of cupcakes) {
    let $newCupcake = createCupcakeElement(cupcake);
    $cupcakesList.append($newCupcake);
  }
}

const $submitButton = $("#submit-new-cupcake");
$submitButton.on("click", addNewCupcakeAndUpdateDOM);

/**
 * Send "POST" request to /cupcakes endpoint to create a new cupcake (based on
 * page form input), and adds the resulting cupcake to the DOM.
 */
async function addNewCupcakeAndUpdateDOM(event) {
  event.preventDefault();

  // axios "post"
  const response = await axios({
    url: `${HOSTNAME}/cupcakes`,
    method: "POST",
    data: {
      flavor: $("input[name='flavor']").val(), // use "id" - there's a way to do it in WTForms
      size: $("select[name='size']").val(),
      rating: $("select[name='rating']").val(),
      image: $("input[name='image']").val(),
      csrf_token: mytoken
    },
  });
  // append html for cupcake to list

  if (response.status === 201) {
    const $newCupcake = createCupcakeElement(response.data.cupcake);
    $cupcakesList.append($newCupcake);
  }
}

/**
 * Creates a single cupcake DOM element, and returns as jQuery object.
 */
function createCupcakeElement(cupcake) {
  return $(`
        <li>
            <img src="${cupcake.image}" alt="a delicious ${cupcake.flavor} cupcake." width="200px" />
            <p>Flavor: ${cupcake.flavor}</p>
            <p>Size: ${cupcake.size}</p>
            <p>Rating: ${cupcake.rating}/10</p>
        </li>
    `);
}

populateCupcakeList();
