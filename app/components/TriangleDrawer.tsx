"use client";

import React, { useEffect, useRef } from "react";
import { useThemeContext } from "./ThemeWrapper";

type Props = {
  sideA: number;
  sideB: number;
  angleC: number;
  width?: number;
  height?: number;
};

export default function TriangleDrawer({
  sideA = 150,
  sideB = 200,
  angleC = 90,
  width = 500,
  height = 400,
}: Props) {
  const { isDark } = useThemeContext();
  console.log("isDark", isDark);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    // 다크 테마에 따른 색상 설정
    const lineColor = isDark ? "#e5e7eb" : "#000000";
    const fillColor = isDark ? "#e5e7eb" : "#000000";
    const arcColor = isDark ? "#9ca3af" : "#666666";
    const arcLabelColor = isDark ? "#d1d5db" : "#333333";
    const gridColor = isDark ? "#4b5563" : "#cccccc";

    // 삼각형 계산
    // sideA는 이제 A의 마주보는 변 (BC)
    // sideB는 이제 B의 마주보는 변 (AC)
    // angleC는 C각
    const a = sideA; // 변 BC (A의 마주보는 변)
    const b = sideB; // 변 AC (B의 마주보는 변)
    const C = (angleC * Math.PI) / 180; // 각 C

    // 코사인 법칙으로 c 변 계산 (AB, C의 마주보는 변)
    const c = Math.sqrt(a * a + b * b - 2 * a * b * Math.cos(C));

    // 나머지 각도 계산 (코사인 법칙)
    const A =
      (Math.acos((b * b + c * c - a * a) / (2 * b * c)) * 180) / Math.PI;
    const B = 180 - angleC - A;

    // 캔버스 사이즈에 맞춰서 스케일 조정
    const padding = 80; // 여백
    const maxWidth = width - padding * 2;
    const maxHeight = height - padding * 2;

    // 삼각형의 실제 크기 계산 (스케일 적용 전)
    const triangleWidth = c;
    const triangleHeight = b * Math.sin(Math.PI - C);

    // 스케일 계산 (캔버스에 맞추기)
    const scale = Math.min(
      maxWidth / triangleWidth,
      maxHeight / triangleHeight,
      1 // 최대 1배까지만 (확대하지 않음)
    );

    // 스케일 적용된 변의 길이
    const scaledA = a * scale;
    const scaledB = b * scale;
    const scaledC = c * scale;

    // 캔버스 중앙에 배치하기 위한 오프셋
    const offsetX = (width - scaledC) / 2;
    const offsetY = height / 2 + (scaledB * Math.sin(Math.PI - C)) / 2;

    // 삼각형 꼭짓점 계산 (A와 C 위치 교환)
    const pointC = { x: offsetX, y: offsetY };
    const pointB = { x: offsetX + scaledC, y: offsetY };
    const pointA = {
      x: offsetX + scaledB * Math.cos(Math.PI - C),
      y: offsetY - scaledB * Math.sin(Math.PI - C),
    };

    // 삼각형 그리기
    ctx.beginPath();
    ctx.moveTo(pointA.x, pointA.y);
    ctx.lineTo(pointB.x, pointB.y);
    ctx.lineTo(pointC.x, pointC.y);
    ctx.closePath();

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // 꼭짓점 표시 (작은 점)
    ctx.fillStyle = fillColor;
    const drawPoint = (point) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 2.5, 0, 2 * Math.PI);
      ctx.fill();
    };

    drawPoint(pointA);
    drawPoint(pointB);
    drawPoint(pointC);

    // 꼭짓점 라벨
    ctx.fillStyle = fillColor;
    ctx.font = "italic 18px serif";
    ctx.fillText("C", pointC.x - 25, pointC.y + 5);
    ctx.fillText("B", pointB.x + 10, pointB.y + 5);
    ctx.fillText("A", pointA.x - 5, pointA.y - 15);

    // 변의 길이 표시 (중점에)
    ctx.font = "italic 15px serif";

    // 변 a (아래쪽) - BC (A의 마주보는 변)
    const midBC = {
      x: (pointB.x + pointC.x) / 2,
      y: (pointB.y + pointC.y) / 2,
    };
    // ctx.fillText(`a = ${a}`, midBC.x - 30, midBC.y + 25);
    ctx.fillText(`a`, midBC.x - 30, midBC.y + 25);

    // 변 c (오른쪽) - AB (C의 마주보는 변)
    const midAB = {
      x: (pointA.x + pointB.x) / 2,
      y: (pointA.y + pointB.y) / 2,
    };
    // ctx.fillText(`c = ${c.toFixed(1)}`, midAB.x + 10, midAB.y + 5);
    ctx.fillText(`c`, midAB.x + 15, midAB.y - 10);

    // 변 b (왼쪽) - AC (B의 마주보는 변)
    const midAC = {
      x: (pointA.x + pointC.x) / 2,
      y: (pointA.y + pointC.y) / 2,
    };
    // ctx.fillText(`b = ${b}`, midAC.x - 40, midAC.y + 5);
    ctx.fillText(`b`, midAC.x - 30, midAC.y + 5);

    // 각도 표시 (호로 표현)
    const arcRadius = 30;

    // 각 A (상단)
    ctx.beginPath();
    ctx.arc(
      pointA.x,
      pointA.y,
      arcRadius,
      Math.atan2(pointC.y - pointA.y, pointC.x - pointA.x),
      Math.atan2(pointB.y - pointA.y, pointB.x - pointA.x),
      true
    );
    ctx.strokeStyle = arcColor;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = arcLabelColor;
    ctx.font = "italic 14px serif";
    ctx.fillText(`${A.toFixed(1)}°`, pointA.x - 10, pointA.y + 45);

    // 각 C (왼쪽 하단)
    ctx.beginPath();
    ctx.arc(
      pointC.x,
      pointC.y,
      arcRadius,
      Math.atan2(pointA.y - pointC.y, pointA.x - pointC.x),
      Math.atan2(pointB.y - pointC.y, pointB.x - pointC.x),
      false
    );
    ctx.stroke();
    ctx.fillText(`${angleC}°`, pointC.x + 15, pointC.y - 20);

    // 각 B (오른쪽 하단)
    ctx.beginPath();
    ctx.arc(
      pointB.x,
      pointB.y,
      arcRadius,
      Math.atan2(pointA.y - pointB.y, pointA.x - pointB.x),
      Math.atan2(pointC.y - pointB.y, pointC.x - pointB.x),
      true
    );
    ctx.stroke();
    ctx.fillText(`${B.toFixed(1)}°`, pointB.x - 50, pointB.y - 20);

    // // 보조선 그리기 (점선)
    // ctx.setLineDash([5, 5]);
    // ctx.strokeStyle = gridColor;
    // ctx.lineWidth = 0.8;

    // // 수평 기준선
    // ctx.beginPath();
    // ctx.moveTo(50, pointA.y);
    // ctx.lineTo(width - 50, pointA.y);
    // ctx.stroke();

    // ctx.setLineDash([]);
  }, [sideA, sideB, angleC, isDark]);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <canvas ref={canvasRef} width={width} height={height} />
    </div>
  );
}
