// Order Timeline Utility Functions

export const ORDER_TIMELINE = {
  PENDING: { days: 0, label: 'Order Received', description: 'Your order has been received and is being processed' },
  CONFIRMED: { days: 1, label: 'Order Confirmed', description: 'Your order has been confirmed and is being prepared' },
  SHIPPED: { days: 3, label: 'Order Shipped', description: 'Your order has been shipped and is on its way' },
  DELIVERED: { days: 5, label: 'Order Delivered', description: 'Your order has been delivered successfully' }
};

export const getOrderTimelineStatus = (orderDate, currentStatus = 'PENDING') => {
  const orderTime = new Date(orderDate);
  const currentTime = new Date();
  const daysElapsed = Math.floor((currentTime - orderTime) / (1000 * 60 * 60 * 24));
  
  // Determine status based on days elapsed
  if (daysElapsed >= 5) return 'DELIVERED';
  if (daysElapsed >= 3) return 'SHIPPED';
  if (daysElapsed >= 1) return 'CONFIRMED';
  return 'PENDING';
};

export const getTimelineProgress = (orderDate, currentStatus = 'PENDING') => {
  const orderTime = new Date(orderDate);
  const currentTime = new Date();
  const daysElapsed = Math.floor((currentTime - orderTime) / (1000 * 60 * 60 * 24));
  
  const timelineStatus = getOrderTimelineStatus(orderDate, currentStatus);
  const timeline = ORDER_TIMELINE[timelineStatus];
  
  return {
    status: timelineStatus,
    daysElapsed,
    progress: Math.min((daysElapsed / 5) * 100, 100),
    nextMilestone: getNextMilestone(daysElapsed),
    estimatedDelivery: getEstimatedDelivery(orderDate),
    timeline: getTimelineSteps(orderDate, timelineStatus)
  };
};

export const getNextMilestone = (daysElapsed) => {
  if (daysElapsed < 1) return { days: 1, label: 'Order Confirmation', description: 'Your order will be confirmed tomorrow' };
  if (daysElapsed < 3) return { days: 3, label: 'Order Shipping', description: 'Your order will be shipped in ' + (3 - daysElapsed) + ' days' };
  if (daysElapsed < 5) return { days: 5, label: 'Order Delivery', description: 'Your order will be delivered in ' + (5 - daysElapsed) + ' days' };
  return { days: 5, label: 'Order Delivered', description: 'Your order has been delivered' };
};

export const getEstimatedDelivery = (orderDate) => {
  const orderTime = new Date(orderDate);
  const deliveryTime = new Date(orderTime.getTime() + (5 * 24 * 60 * 60 * 1000)); // Add 5 days
  return deliveryTime;
};

export const getTimelineSteps = (orderDate, currentStatus) => {
  const orderTime = new Date(orderDate);
  const steps = [
    {
      status: 'PENDING',
      label: 'Order Received',
      description: 'Your order has been received',
      completed: true,
      date: orderTime,
      icon: 'clock'
    },
    {
      status: 'CONFIRMED',
      label: 'Order Confirmed',
      description: 'Your order has been confirmed',
      completed: ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(currentStatus),
      date: new Date(orderTime.getTime() + (1 * 24 * 60 * 60 * 1000)),
      icon: 'check-circle'
    },
    {
      status: 'SHIPPED',
      label: 'Order Shipped',
      description: 'Your order has been shipped',
      completed: ['SHIPPED', 'DELIVERED'].includes(currentStatus),
      date: new Date(orderTime.getTime() + (3 * 24 * 60 * 60 * 1000)),
      icon: 'truck'
    },
    {
      status: 'DELIVERED',
      label: 'Order Delivered',
      description: 'Your order has been delivered',
      completed: currentStatus === 'DELIVERED',
      date: new Date(orderTime.getTime() + (5 * 24 * 60 * 60 * 1000)),
      icon: 'check-circle'
    }
  ];
  
  return steps;
};

export const formatTimelineDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getDaysUntilDelivery = (orderDate) => {
  const orderTime = new Date(orderDate);
  const currentTime = new Date();
  const deliveryTime = new Date(orderTime.getTime() + (5 * 24 * 60 * 60 * 1000));
  const daysUntil = Math.ceil((deliveryTime - currentTime) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysUntil);
};
