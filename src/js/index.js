"use strict";
const noPost = $("#noPost");
const form = $("#yourPost");
const postArea = $("#postArea");

const url = "https://blog-api-t6u0.onrender.com/posts/";
//-----API methods-----
async function get() {
  try {
    let respons = await fetch(url, {
      method: "GET",
    });
    let data = await respons.json();

    return data;
  } catch (error) {
    console.log("Error: " + error);
  }
}
async function post(form) {
  try {
    let respons = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    let data = await respons.json();

    return data;
  } catch (error) {
    console.log("Error: " + error);
  }
}
async function put(id, form) {
  try {
    let respons = await fetch(url + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    let data = await respons.json();
    return data;
  } catch (error) {
    console.log("Error: " + error);
  }
}

async function del(id) {
  try {
    let respons = await fetch(url + id, {
      method: "DELETE",
    });
    let data = await respons.json();
    return data;
  } catch (error) {
    console.log("Error: " + error);
  }
}

window.onload = async function () {
  const posts = await get();
  renderPosts(posts);
};

$("#alertClose").on("click", function () {
  $("#alert").fadeOut("slow");

  setTimeout(function () {
    $("#alert").addClass("d-none");
  }, 500);
});
//-----Submit Button---------------------

form.on("submit", async function (e) {
  e.preventDefault();
  if (this.title.value == "" || this.desc.value == "") {
    $("#alert").fadeIn("slow");

    $("#alert").removeClass("d-none");
    return;
  }
  let data = { title: `${this.title.value}`, body: `${this.desc.value}` };
  this.title.value = "";
  this.desc.value = "";

  await post(data);
  const posts = await get();
  renderPosts(posts);
});

//-------Render function-----------------------

function renderPosts(posts) {
// console.log(posts[posts.length-1].id);
  if (posts[posts.length-1].id <= 100) {
    noPost.removeClass("d-none");

  } else {
    noPost.addClass("d-none");

  }

  let datas = posts.reverse().map((el) => {
    if (el.id > 100) {
      return `<div class="card w-75 ">
            <div class="card-header h1 text-info">
              ${el.title}
            </div>
            <div class="card-body">
              <h3 class="card-title text-primary-emphasis p-3">${el.body}</h3>
              <a  class="btn btn-outline-danger" onclick="delAndRender(${el.id})" >Delete</a>
              <a class="btn btn-outline-warning" onclick="editAndRender(${el.id},'${el.title}','${el.body}')">Edit</a>
            </div>
            </div>`;
    }
    return "";
  });
  postArea.html(datas.join(""));
}
//-----Delete function--------------------------------
async function delAndRender(id) {
  await del(id);
  const newDatas = await get();
  renderPosts(newDatas);
}

//-----Enter button--------------------------------

form.find("[name='title']").on("keydown", async function (evt) {
  if (evt.key === "Enter") {
    evt.preventDefault();
    if (this.value == "" || form.find("[name='desc']").val() == "") {
      $("#alert").fadeIn("slow");

      $("#alert").removeClass("d-none");
      return;
    }
    let data = {
      title: `${this.value}`,
      body: `${form.find("[name='desc']").val()}`,
    };

    this.value = "";
    form.find("[name='desc']").val("");

    await post(data);
    const posts = await get();
    renderPosts(posts);
  }
});

//----Save and Render function --------------------------------
async function saveAndRender(id, title, desc) {
  let editedData = { title: title, body: desc };
  await put(id, editedData);
  const newDatas = await get();

  renderPosts(newDatas);
}

//----Render edit div----------

function editAndRender(id, title, body) {
  $("#editDiv").removeClass("d-none");
  $("#editedTitle").val(title);
  $("#editedDesc").val(body);

  $("#save").on("click", function () {
    saveAndRender(id, $("#editedTitle").val(), $("#editedDesc").val());
    $("#editDiv").addClass("d-none");
  });
}
//-----Close---------------------
function closeBtn() {
  $("#editDiv").addClass("d-none");
}
