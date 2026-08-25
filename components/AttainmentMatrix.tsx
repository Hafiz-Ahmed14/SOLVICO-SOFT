import { site } from "@/content/site";

/**
 * A CO–PO mapping matrix — the artifact an accreditation visit actually asks
 * for, and the thing OBE Framework exists to produce. Shown as a real table
 * with row/column scopes so it reads correctly to a screen reader; cell
 * values are illustrative mapping strengths (1 weak – 3 strong).
 */
const POS = ["PO1", "PO2", "PO3", "PO4", "PO5", "PO6"];

const ROWS: { co: string; cells: number[] }[] = [
  { co: "CO1", cells: [3, 2, 0, 1, 0, 0] },
  { co: "CO2", cells: [2, 3, 2, 0, 1, 0] },
  { co: "CO3", cells: [0, 2, 3, 2, 0, 1] },
  { co: "CO4", cells: [1, 0, 2, 3, 2, 0] },
  { co: "CO5", cells: [0, 1, 0, 2, 3, 2] },
];

const STRENGTH = ["", "weak", "moderate", "strong"];

export default function AttainmentMatrix() {
  return (
    <div className="matrix">
      <table>
        <caption>Course outcome → programme outcome mapping</caption>
        <thead>
          <tr>
            <th scope="col">
              <span className="matrix-corner">CO / PO</span>
            </th>
            {POS.map((po) => (
              <th key={po} scope="col">
                {po}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.co}>
              <th scope="row">{row.co}</th>
              {row.cells.map((v, i) => (
                <td key={POS[i]}>
                  <span
                    className={`cell cell-${v}`}
                    title={
                      v === 0
                        ? `${row.co} not mapped to ${POS[i]}`
                        : `${row.co} → ${POS[i]}: ${STRENGTH[v]} (${v})`
                    }
                  >
                    {v === 0 ? "" : v}
                  </span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="matrix-note">
        Illustrative mapping. In {site.name}&rsquo;s OBE Framework the strengths are set per
        course and attainment is computed from entered assessment marks.
      </p>
    </div>
  );
}
