document.addEventListener('DOMContentLoaded', function() {
    const notificationButton = document.querySelector('.notification-bar .notification-button');
    const badge = document.querySelector('.notification-bar .badge');
    const notificationItems = document.querySelectorAll('.notification-bar .notification-item.unread');
    const notificationContent = document.querySelector('.notification-bar .notification-content');

    // Update badge with the count of unread notifications
    badge.textContent = notificationItems.length;

    // Toggle notification display on button click
    notificationButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent click event from bubbling up
        notificationContent.classList.toggle('show');
    });

    // Hide notifications when clicking outside
    document.addEventListener('click', function(event) {
        if (!notificationContent.contains(event.target) && !notificationButton.contains(event.target)) {
            notificationContent.classList.remove('show');
        }
    });
});
