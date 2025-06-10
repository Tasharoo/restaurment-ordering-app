import menu from "./data.js";

const totalItems = [];
const menuEl = document.getElementById("menu");
const totalEl = document.getElementById("total");
const paymentPopUp = document.getElementById("payment-popUp");
const closeModal = document.getElementById("close-modal");
const completePayment = document.getElementById("complete-payment");

function menuHTML() {
  let menuHTML = "";
  menu.forEach((menu, index) => {
    menuHTML += `
        <div class="container menu">
          <div>${menu.emoji}</div>
          <div>${menu.name}</div>
          <div>${menu.ingredients}</div>
          <div>${menu.price}</div>
        
          <div class="menuBtn" >
            <button class="plus " id="plus" data-index="${index}">+</button>
            <button class="minus " id ="minus" data-index="${index}"  >-</button>
            
          </div>
        </div>
      `;
  });
  menuEl.innerHTML = menuHTML;
}
menuHTML();

function updateHTML() {
  const totalPrce = totalItems
    .reduce((sum, menu) => sum + menu.price, 0)
    .toFixed(2);

  const itemHTML = totalItems
    .map((menu) => `<li>${menu.name}  £${menu.price}</li>`)
    .join("");

  totalEl.innerHTML = `
      <ul>
      ${itemHTML || "<li>No items in your cart</il>"}
      </ul>
      <h2 class="total">Your total is ${totalPrce}</h2>
      <div>
      <button class="paymentBtn " id="payment" >Pay</button>
      </div>
      <hr>
    `;
  const discount = 10;
  if (totalPrce >= 30) {
    totalEl.innerHTML += `<h2 class="discount">You have a discount of £${discount} for orders over £30</h2>`;
    const discountedTotal = (totalPrce - discount).toFixed(2);
    totalEl.innerHTML += `<h2 class="total">Your total after discount is £${discountedTotal}</h2>`;
  } else {
    totalEl.innerHTML += `<h2 class="discount">You need to order more than £30 to get a discount</h2>`;
  }

  const paymentBtn = document.getElementById("payment");
  if (paymentBtn) {
    paymentBtn.addEventListener("click", () => {
      paymentPopUp.style.display = "block";
    });
  }
}
updateHTML();

menuEl.addEventListener("click", (event) => {
  const target = event.target;
  if (target.dataset.index !== undefined) {
    const index = parseInt(target.dataset.index);
    if (!isNaN(index) && index >= 0 && index < menu.length) {
      const item = {
        name: menu[index].name,
        price: menu[index].price,
      };
      if (target.classList.contains("plus")) {
        totalItems.push(item);
        updateHTML();
      } else if (target.classList.contains("minus")) {
        const itemindex = totalItems.findIndex(
          (i) => i.name === item.name && i.price === item.price
        );
        if (itemindex !== -1) {
          totalItems.splice(itemindex, 1);
          updateHTML();
        }
      }
    }
  }
});

document.getElementById("payment").addEventListener("click", () => {
  paymentPopUp.style.display = "block";
});

closeModal.addEventListener("click", () => {
  paymentPopUp.style.display = "none";
  window.location.reload();
});

completePayment.addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const cardDetails = document.getElementById("cardDetails").value;
  const cvvNumber = document.getElementById("CvvNumber").value;
  const isNameVailed = name !== " " && /^[a-zA-Z\s]+$/.test(name);
  const isCardDetailsVailed =
    cardDetails !== " " && /^\d{16}$/.test(cardDetails);
  const isCvvNumberVailed = cvvNumber !== " " && /^\d{3,4}$/.test(cvvNumber);

  if (!isNameVailed || !isCardDetailsVailed || !isCvvNumberVailed) {
    alert(`
      Please ensure all inputs are filled out correctly:
      Name cannot be empty and must contain only letters
      Card details must be a 16-digit number
      CVV should be 3 or 4-digit number
      `);
  } else {
    totalEl.innerHTML = `<h2>Thank you for ordering! Your food will be with you shortly</h2>`;
    paymentPopUp.style.display = "none";

    setTimeout(() => {
      window.location.reload();
    }, 4000);
  }
});
