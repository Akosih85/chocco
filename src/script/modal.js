const validateFields = (form, fieldsArray) => {
  
  fieldsArray.forEach(field => {    
    field.removeClass("input-error");  
    if (field.val().trim() === "") {
      field.addClass("input-error");
    }
  });
  
  const errorFields = form.find(".input-error");

  return errorFields.length === 0;
}

let statusFormDone = {};

$(".form").submit(e => {
  e.preventDefault();

  const form = $(e.currentTarget);
  const name = form.find("[name='name']");
  const phone = form.find("[name='phone']");
  const comment = form.find("[name='comment']");
  const to = form.find("[name='to']");

  const modal = $(".modal");
  const content = modal.find(".modal__content");

  modal.removeClass("error-modal");

  const isValid = validateFields(form, [name, phone, comment, to]);

  if (isValid) {
    const request = $.ajax({
      url: "https://webdev-api.loftschool.com/sendmail",
      method: "post",
      data: {
        name: name.val(),
        phone: phone.val(),
        comment: comment.val(),
        to: to.val(),
      },
    });
    
    request.done(data => {
      statusFormDone = true;
      content.text(data.message);
    });
    
    request.fail(data => {
      statusFormDone = false;
      content.text(data.responseJSON.message);
      modal.addClass("error-modal");      
    });
    
    request.always(() => {
      $.fancybox.open({
        src: ".modal",
        type: "inline",
      });
    });
  }
});


$('.app-submit-btn').on('click', e => {
  e.preventDefault();
  
  if (statusFormDone) {
    $('.form')[0].reset();
  };

  $.fancybox.close();
})