import React from 'react';
import { Clock, CheckCircle, Truck, Package } from 'lucide-react';

const OrderTimeline = ({ orderDate, currentStatus, className = '' }) => {
  const getTimelineSteps = () => {
    const orderTime = new Date(orderDate);
    const steps = [
      {
        status: 'PENDING',
        label: 'Order Received',
        description: 'Your order has been received',
        completed: true,
        date: orderTime,
        icon: Clock
      },
      {
        status: 'CONFIRMED',
        label: 'Order Confirmed',
        description: 'Your order has been confirmed',
        completed: ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(currentStatus),
        date: new Date(orderTime.getTime() + (1 * 24 * 60 * 60 * 1000)),
        icon: CheckCircle
      },
      {
        status: 'SHIPPED',
        label: 'Order Shipped',
        description: 'Your order has been shipped',
        completed: ['SHIPPED', 'DELIVERED'].includes(currentStatus),
        date: new Date(orderTime.getTime() + (3 * 24 * 60 * 60 * 1000)),
        icon: Truck
      },
      {
        status: 'DELIVERED',
        label: 'Order Delivered',
        description: 'Your order has been delivered',
        completed: currentStatus === 'DELIVERED',
        date: new Date(orderTime.getTime() + (5 * 24 * 60 * 60 * 1000)),
        icon: Package
      }
    ];
    
    return steps;
  };

  const steps = getTimelineSteps();
  const currentStepIndex = steps.findIndex(step => step.status === currentStatus);

  return (
    <div className={`order-timeline ${className}`}>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-neutral-200"></div>
        
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = index === currentStepIndex;
          const isCompleted = step.completed;
          const isUpcoming = index > currentStepIndex;
          
          return (
            <div key={step.status} className="relative flex items-start gap-4 pb-8 last:pb-0">
              {/* Timeline dot */}
              <div className={`
                relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300
                ${isCompleted 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : isActive 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'bg-white border-neutral-300 text-neutral-400'
                }
              `}>
                <Icon size={20} />
              </div>
              
              {/* Timeline content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`
                    font-semibold transition-colors duration-300
                    ${isCompleted || isActive 
                      ? 'text-neutral-800' 
                      : 'text-neutral-500'
                    }
                  `}>
                    {step.label}
                  </h4>
                  {isCompleted && (
                    <CheckCircle size={16} className="text-green-500" />
                  )}
                </div>
                
                <p className={`
                  text-sm transition-colors duration-300
                  ${isCompleted || isActive 
                    ? 'text-neutral-600' 
                    : 'text-neutral-400'
                  }
                `}>
                  {step.description}
                </p>
                
                <p className={`
                  text-xs mt-1 transition-colors duration-300
                  ${isCompleted || isActive 
                    ? 'text-neutral-500' 
                    : 'text-neutral-400'
                  }
                `}>
                  {isCompleted ? 'Completed' : isActive ? 'In Progress' : 'Upcoming'} • {step.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderTimeline;
