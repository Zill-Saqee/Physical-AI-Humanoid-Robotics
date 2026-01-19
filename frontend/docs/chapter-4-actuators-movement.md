---
sidebar_position: 4
title: "Chapter 4: Actuators and Movement"
description: "Learn about the motors, mechanisms, and control systems that enable robots to move and interact with the physical world"
keywords: [actuators, robot motors, locomotion, manipulation, motion control]
---

# Chapter 4: Actuators and Movement

**Estimated reading time: 7 minutes**

## From Thought to Action

While sensors let robots perceive the world, actuators enable them to change it. Actuators are the "muscles" of a robot—devices that convert electrical, hydraulic, or pneumatic energy into physical motion.

In this chapter, we explore the various types of actuators used in humanoid robots and the principles that govern how they move.

## Types of Actuators

### Electric Motors

Electric motors are the most common actuators in modern humanoid robots, offering excellent control and efficiency.

**DC Motors**: Simple, continuous rotation motors good for wheels and fans.

**Brushless DC Motors (BLDC)**: More efficient and durable than brushed motors, commonly used in robot joints.

**Servo Motors**: Motors with built-in position feedback and control, enabling precise positioning.

**Stepper Motors**: Move in discrete steps, useful for precise positioning without feedback systems.

#### Advantages of Electric Motors
- Precise control
- Clean operation (no fluids)
- Relatively quiet
- Good efficiency
- Well-understood technology

#### Limitations
- Limited power-to-weight ratio compared to hydraulics
- Can overheat under continuous load
- Require gearing for high-torque applications

### Hydraulic Actuators

Hydraulic systems use pressurized fluid to generate force, offering exceptional strength.

**How They Work**: A pump pressurizes fluid, which is directed to cylinders or motors where the pressure creates motion.

#### Where Hydraulics Excel
- Very high force output
- Excellent power-to-weight ratio
- Natural shock absorption

**Example**: Boston Dynamics' Atlas robot uses hydraulic actuators, enabling its remarkable jumping and acrobatic capabilities.

#### Challenges
- Requires pumps, reservoirs, and hoses
- Risk of fluid leaks
- More complex maintenance
- Can be noisy

### Pneumatic Actuators

Pneumatic systems use compressed air rather than fluid.

#### Characteristics
- Fast actuation
- Inherent compliance (softness)
- Simpler than hydraulics
- Limited force and precision

**Applications**: Often used in soft robotics and for gripping, where gentle, compliant motion is desired.

### Emerging Actuator Technologies

#### Artificial Muscles

Researchers are developing materials that contract like biological muscles:

**Shape Memory Alloys (SMA)**: Metals that change shape when heated, then return to original form when cooled.

**Electroactive Polymers (EAP)**: Plastics that change shape in response to electrical stimulation.

**Cable-Driven Systems**: Flexible cables routed through the body, mimicking tendons in biological systems.

#### Series Elastic Actuators (SEA)

SEAs place a spring between the motor and the load. Benefits include:

- Natural energy storage and return
- Built-in compliance for safety
- Force sensing through spring deflection
- Smoother motion

## Motion Control Fundamentals

### Position Control

The most basic form of control: moving a joint to a specified position.

**PID Control**: The most common control algorithm, using:
- **Proportional** (P): How far from the target
- **Integral** (I): Accumulated error over time
- **Derivative** (D): Rate of change of error

### Velocity Control

Controlling the speed of movement rather than just the endpoint. Important for:

- Smooth, natural-looking motion
- Continuous operations like walking
- Trajectory following

### Force/Torque Control

Controlling the force or torque output of a joint. Essential for:

- Safe interaction with humans and objects
- Compliant movement (yielding to external forces)
- Precise manipulation tasks

### Impedance Control

A hybrid approach that controls the relationship between force and motion. The robot behaves like a spring-damper system:

- Stiff when precision is needed
- Compliant when safety or adaptability is required
- Can switch between modes dynamically

## Locomotion: How Robots Walk

### The Phases of Walking

Human walking consists of alternating phases for each leg:

1. **Stance Phase**: The foot is on the ground, supporting and propelling the body
2. **Swing Phase**: The foot is in the air, moving forward for the next step

The transitions between these phases are critical for stable walking.

### Static vs. Dynamic Walking

**Static Walking**: The robot's center of mass always remains within its base of support. Safe but slow and energy-intensive.

**Dynamic Walking**: The robot deliberately falls forward, catching itself with the next step. More natural and efficient but requires sophisticated balance control.

### Zero Moment Point (ZMP)

ZMP is a key concept in humanoid locomotion. It represents the point on the ground where the total rotational force is zero. Keeping the ZMP within the support polygon (area between the feet) helps maintain balance.

### Capture Point

A related concept used in dynamic walking: the point where the robot could step to come to a complete stop. By controlling where this point falls, robots can recover from pushes and stumbles.

## Manipulation: Robot Hands and Arms

### Arm Kinematics

Moving a robotic arm to a desired position involves:

**Forward Kinematics**: Given joint angles, calculate where the hand ends up.

**Inverse Kinematics**: Given a desired hand position, calculate the required joint angles. This is the more common (and more difficult) problem.

### Grasp Planning

Picking up objects requires:

1. Perceiving the object's shape and position
2. Planning approach trajectory
3. Selecting grasp points
4. Executing the grasp
5. Monitoring grip stability

### Types of Grasps

**Power Grasp**: Wrapping fingers around an object for maximum stability (holding a hammer).

**Precision Grasp**: Using fingertips for delicate manipulation (holding a pen).

**Hook Grasp**: Using curved fingers to carry objects (holding a bag handle).

## Coordination and Whole-Body Control

Humanoid robots rarely move just one joint at a time. Walking requires coordinating dozens of joints simultaneously.

### Whole-Body Control

Advanced control systems manage:

- Balance maintenance
- Task execution (reaching, walking)
- Collision avoidance
- Energy optimization

All while coordinating 30-50+ degrees of freedom.

### Motion Primitives

Complex movements can be built from simpler building blocks:

- Reaching motions
- Stepping patterns
- Manipulation actions

These primitives can be combined and adapted to create new behaviors.

## Safety in Actuation

### Collision Detection

Robots must detect unplanned contacts quickly:

- Current monitoring in motors
- Force/torque sensors
- Joint position tracking

### Compliant Actuation

Making robots inherently safer:

- Series elastic actuators that absorb impacts
- Soft covers and padding
- Force-limiting control modes

### Speed and Force Limits

Setting bounds on how fast and how hard a robot can move, especially around people.

## Key Takeaways

1. **Electric motors** are the most common actuators, with hydraulics used when high forces are needed
2. **Motion control** ranges from simple position control to sophisticated impedance control
3. **Walking** involves complex coordination of stance and swing phases with balance maintenance
4. **Manipulation** requires solving inverse kinematics and planning stable grasps
5. **Safety** is paramount, achieved through compliant mechanisms and smart control

## Next Chapter

With perception and action capabilities established, we now explore how AI and machine learning bring intelligence to these physical systems.

**[Continue to Chapter 5: AI/ML Integration →](/chapter-5-ai-ml-integration)**
