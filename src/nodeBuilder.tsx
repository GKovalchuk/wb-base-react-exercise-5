import {useState, useEffect, createElement} from "react";

// Типы
type Attributes = { [key: string]: string; };
type Node = {
  tag: string;
  attrs?: Attributes;
  children?: Array<Node | string>;
};

// Список тегов без детей
const SELF_CLOSING_TAGS = [
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 
  'input', 'link', 'meta', 'source', 'track', 'wbr'
];

// Преобразуем атрибуты
const transformAttributes = (attrs?: Attributes): Attributes | undefined => {
  if (!attrs) return undefined;

  const transformedAttrs: Attributes = {};

  for (const key in attrs) {
    if (key === "class") transformedAttrs["className"] = attrs[key];
    else transformedAttrs[key] = attrs[key];
  }

  return transformedAttrs;
};

// Создаем ноды
const createElementFromJson = (node: Node): React.ReactNode => {
  const { tag, attrs, children } = node;
  const transformedAttrs = transformAttributes(attrs);

  // Проверяем на возможность налчичия у тега детей
  if (SELF_CLOSING_TAGS.includes(tag)) return createElement(tag, { ...transformedAttrs, key: Math.random() });

  const childElements = children?.map(child => typeof child === "string" ? child : createElementFromJson(child));

  return createElement(tag, { ...transformedAttrs, key: Math.random() }, childElements);
};

// Возвращаем ноды
const NodeBuilder = () => {
  const [componentData, setComponentData] = useState<Node | null>(null);

  useEffect(() => {
    fetch("/component.json")
      .then((response) => response.json())
      .then((data) => setComponentData(data))
      .catch((error) => console.error("Ошибка загрузки JSON:", error));
  }, []);

  return (
    <main>
      {componentData && createElementFromJson(componentData) || <p>Что-то пошло не так</p>}
    </main>
  );
};

export default NodeBuilder
