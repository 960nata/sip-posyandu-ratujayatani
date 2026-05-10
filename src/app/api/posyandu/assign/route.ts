import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  const session = await auth()
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { posyanduId, userIds } = body // userIds is an array of strings

  if (!posyanduId || !userIds) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  // Update all users in the list to have the posyanduId
  await prisma.user.updateMany({
    where: {
      id: { in: userIds }
    },
    data: {
      posyanduId: posyanduId
    }
  })

  return NextResponse.json({ success: true })
}
