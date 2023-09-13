let button = document.querySelector("#generate-otp");
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NGZhMGFjMjM0NTI1YmNmNmNlZjBmMGQiLCJlbWFpbCI6InRyaXZlb3VzQGdtYWlsLmNvbSIsImlhdCI6MTY5NDUzODA3NSwiZXhwIjoxNjk0NTQ1Mjc1fQ.f_a6PPBivZ3AxBhWtJdVahRMZvNOm0g0_1xW_tA9WEU"
button.addEventListener("click", (e) => {
  e.preventDefault();
  console.log("click");
  fetch("http://localhost:8080/orders/generate-otp", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      if (!data.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "OTP generate limit exceeded. Please try after 1 minute.",
        });
      } else {
        Swal.fire("OTP generated successfully");
      }
    })
    .catch((err) => {
      console.log(err.message);
    });
});

const orderForm = document.getElementById("orderForm");
orderForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const otp = document.getElementById("otp").value;

  fetch("http://localhost:8080/orders/verified-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ otp }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        Swal.fire("Order placed successfully!");
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Invalid OTP. Please try again.",
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});