import { ProblemWithoutIdType } from "@/types";

export const PROBLEM_SAMPLE_1: ProblemWithoutIdType = {
  statement:
    "Suppose there is a carton paper with the dimensions $24 \\text{ m} \\times 9 \\text{ m}$, and an open box will be made out of it. Determine the maximum possible volume of the box, in $\\text{m}^3$.",
  title: "Maximum Volume of Box",
  topic: "calculus",
  subtopic: "applications-of-derivative",
  type: "short_answer",
  answer: 400,
};

export const PROBLEM_SAMPLE_2: ProblemWithoutIdType = {
  statement:
    "A $17 \\text{ ft}$ ladder leaning against a wall begins to slide. How fast is the top of the ladder sliding down the wall at the instant of time when the bottom of the ladder is $8 \\text{ ft}$ from the wall and sliding away from the wall at the rate of $5 \\text{ ft/sec}$? Express your answer in $\\text{ft/sec}$.",
  title: "Leaning Ladder",
  topic: "calculus",
  subtopic: "applications-of-derivative",
  type: "short_answer",
  answer: -2.5,
};

export const PROBLEM_SAMPLE_3: ProblemWithoutIdType = {
  statement:
    "A coffee pot that has the shape of a circular cylinder of radius $8 \\text{ cm}$ is being filled with water flowing at a export constant rate. At what rate, in $\\text{cm}^3\\text{/sec}$, is the water flowing into the coffee pot when the water level is rising at the rate of $1 \\text{ cm/sec}$? Express your answer in terms of $\\pi$.",
  title: "Filling Water",
  topic: "calculus",
  subtopic: "applications-of-derivative",
  type: "short_answer",
  answer: 64,
};

export const PROBLEM_SAMPLE_4: ProblemWithoutIdType = {
  statement:
    "The equation $V = IR$ shows the relation between voltage $V$ in volts (V), the current $I$ in amperes (A) and the resistance $R$ in ohms ($\\ohm$). When $V = 24$ and $I = 4$, V is increasing at the rate of $8 \\text{ V/sec}$, and I is increasing at the rate of $4 \\text{ A/sec}$, how fast is the resistance changing? Express your answer in $\\ohm\\text{/sec}$.",
  title: "Increasing Voltage",
  topic: "calculus",
  subtopic: "applications-of-derivative",
  type: "short_answer",
  answer: 20,
};

export const PROBLEM_SAMPLE_5: ProblemWithoutIdType = {
  statement:
    "Provided $A=\\begin{bmatrix} -1 & 7 & -1\\\\ 0 & 1 & 0\\\\ 0 & 15 & 2 \\end{bmatrix}$, calculate $A^{11}$.",
  title: "Eleventh Power",
  topic: "linear-algebra",
  subtopic: "eigenvalues-eigenvectors",
  type: "matrix",
  matrixHeight: 3,
  matrixWidth: 3,
  answer: [
    [-1, -10223, -683],
    [0, 1, 0],
    [0, 30705, 2048],
  ],
};

export const PROBLEM_SAMPLE_6: ProblemWithoutIdType = {
  statement:
    "Determine the value of the constant $p$ such that the following differential equation is an exact ODE.  \n\n $$ (3y^3 e^{3xy}-1) + (pye^{3xy}+3xy^2e^{3xy})y'=0 $$",
  title: "Exact ODE",
  topic: "calculus",
  subtopic: "first-order-differential-equations",
  type: "short_answer",
  answer: 2,
};

export const PROBLEM_SAMPLE_7: ProblemWithoutIdType = {
  statement:
    "Determine the distance between the given planes:  \n\n $$ \\begin{matrix} 2x-y+z&= 1\\\\ -2x + y - z&= 1 \\end{matrix} $$  \nRound the answer to the 5th decimal place.",
  title: "Distance of Two Planes",
  topic: "linear-algebra",
  subtopic: "lines-planes",
  type: "short_answer",
  answer: "0.816497",
};
