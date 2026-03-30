$(function () {
  $('.js-coupon-list-toggle').on('click', function () {
    var $btn = $(this);
    var $body = $btn.next('.js-coupon-list-body');
    var isOpen = $btn.attr('aria-expanded') === 'true';

    $btn.attr('aria-expanded', !isOpen);
    $body.toggleClass('c-coupon-list__body--open');
  });
});
