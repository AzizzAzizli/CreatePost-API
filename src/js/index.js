"use strict";
const noPost = $("#noPost");
const form = $("#yourPost");
const postArea = $("#postArea");

const url = "https://blog-api-t6u0.onrender.com/posts/";

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

document.addEventListener("DOMContentLoaded", async function () {
  const posts = await get();

  renderPosts(posts);
});

form.on("submit", async function (e) {
  e.preventDefault();
  let data = { title: `${this.title.value}`, body: `${this.desc.value}` };
  this.title.value = "";
  this.desc.value = "";

  await post(data);
  const posts = await get();
  renderPosts(posts);
});
function renderPosts(posts) {
  let datas = posts.map((el) => {
    if (el.id > 100) {
      return `<div class="card w-75">
            <div class="card-header h1 text-info">
              ${el.title}
            </div>
            <div class="card-body">
              <h3 class="card-title text-primary-emphasis">${el.body}</h3>
              
              <a  class="btn btn-danger" onclick="delAndRender(${el.id})" >Delete</a>
            </div>
            </div>`;
    }

    return "";
  });
  postArea.html(datas.join(""));
}

async function delAndRender(id) {
  await del(id);
  const newDatas = await get();
  renderPosts(newDatas);
}

form.find("[name='title']").on("keydown", async function (evt) {
  if (evt.key === "Enter") {
    evt.preventDefault();

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
