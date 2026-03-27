$(function () {
  $('.js-favorite-products-toggle').on('click', function () {
    var $btn = $(this);
    var $body = $btn.next('.js-favorite-products-body');
    var isOpen = $btn.attr('aria-expanded') === 'true';
    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('is-open');
  });
});
