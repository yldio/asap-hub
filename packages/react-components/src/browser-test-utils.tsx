/* istanbul ignore file */
export const getBoundingClientRect = async (
  selector: string,
): Promise<DOMRect> =>
  page.$eval(selector, (elem: Element) =>
    elem.getBoundingClientRect().toJSON(),
  );
